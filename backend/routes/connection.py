import asyncio
import json
import paramiko
import telnetlib3
import traceback
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class SSHConnection:
    def __init__(self, websocket: WebSocket, host, port, username, password):
        self.websocket = websocket
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            self.ssh.connect(
                hostname=host,
                port=port,
                username=username,
                password=password,
                timeout=10,
                allow_agent=False,
                look_for_keys=False,
                banner_timeout=10,
            )
        except paramiko.AuthenticationException as e:
            raise Exception(f"Authentication failed: {str(e)}")
        except paramiko.SSHException as e:
            raise Exception(f"SSH error: {str(e)}")
        except Exception as e:
            raise Exception(f"Connection error: {str(e)}")

        self.channel = self.ssh.get_transport().open_session()
        self.channel.get_pty(term="xterm", width=80, height=24)
        self.channel.invoke_shell()
        self.channel.settimeout(0.0)

    async def read_data(self):
        """Continuously read data from SSH connection and send to WebSocket"""
        try:
            while True:
                if self.channel.recv_ready():
                    data = self.channel.recv(4096)
                    if not data:
                        break
                    await self.websocket.send_bytes(data)

                if self.channel.closed:
                    await self.websocket.send_text(
                        json.dumps({"type": "error", "data": "SSH connection closed"})
                    )
                    break

                await asyncio.sleep(0.01)
        except Exception as e:
            print(f"Error reading SSH data: {e}")
            traceback.print_exc()
            await self.websocket.send_text(
                json.dumps({"type": "error", "data": f"Read error: {str(e)}"})
            )

    async def write_data(self, data):
        """Write data to SSH connection"""
        try:
            if self.channel.send_ready():
                self.channel.send(data)
        except Exception as e:
            print(f"Error writing SSH data: {e}")
            await self.websocket.send_text(
                json.dumps({"type": "error", "data": f"Write error: {str(e)}"})
            )

    def resize_pty(self, width, height):
        """Resize the pseudo-terminal"""
        try:
            self.channel.resize_pty(width=width, height=height)
        except Exception as e:
            print(f"Error resizing pty: {str(e)}")

    def close(self):
        """Close SSH connection"""
        try:
            if self.channel:
                self.channel.close()
            if self.ssh:
                self.ssh.close()
        except Exception as e:
            print(f"Error closing SSH connection: {e}")


class TelnetConnection:
    def __init__(self, websocket: WebSocket, host, port, username: Optional[str] = None, password: Optional[str] = None):
        self.websocket = websocket
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.reader = None
        self.writer = None
        self.connected = False

    async def connect(self):
        """Establish Telnet connection"""
        try:
            self.reader, self.writer = await telnetlib3.open_connection(
                host=self.host,
                port=self.port,
                shell=None,
                connect_minwait=0.2,
                connect_maxwait=5.0
            )
            
            self.connected = True
            
            if self.username and self.password:
                await asyncio.sleep(0.5)
                
                self.writer.write(self.username + "\r\n")
                await asyncio.sleep(0.5)
                
                self.writer.write(self.password + "\r\n")
                await asyncio.sleep(0.5)
                
                self.writer.write("\r\n")
                
            return True
            
        except Exception as e:
            raise Exception(f"Telnet connection error: {str(e)}")

    async def read_data(self):
        """Continuously read data from Telnet connection and send to WebSocket"""
        try:
            while self.connected and self.reader:
                try:
                    # Read data with timeout
                    data = await asyncio.wait_for(self.reader.read(4096), timeout=0.1)
                    if data:
                        await self.websocket.send_bytes(data.encode('utf-8'))
                    await asyncio.sleep(0.01)
                except asyncio.TimeoutError:
                    # This is normal - just means no data available
                    continue
                except Exception as e:
                    if "EOF" in str(e) or not self.connected:
                        break
                    raise
                    
        except Exception as e:
            print(f"Error reading Telnet data: {e}")
            traceback.print_exc()
            await self.websocket.send_text(
                json.dumps({"type": "error", "data": f"Telnet read error: {str(e)}"})
            )
        finally:
            self.connected = False

    async def write_data(self, data):
        """Write data to Telnet connection"""
        try:
            if self.connected and self.writer:
                self.writer.write(data)
                await self.writer.drain()
        except Exception as e:
            print(f"Error writing Telnet data: {e}")
            await self.websocket.send_text(
                json.dumps({"type": "error", "data": f"Telnet write error: {str(e)}"})
            )

    def resize_pty(self, width, height):
        """Telnet doesn't typically support dynamic resizing, but we can log it"""
        print(f"Telnet resize requested: {width}x{height}")
        # Some telnet implementations might support NAWS (Negotiate About Window Size)
        # but telnetlib3 doesn't have built-in support for this

    def close(self):
        """Close Telnet connection"""
        try:
            self.connected = False
            if self.writer:
                self.writer.close()
        except Exception as e:
            print(f"Error closing Telnet connection: {e}")


@router.websocket("/terminal")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for both SSH and Telnet connections.
    
    Expected message format:
    1. Connect:
        {
            "type": "connect",
            "protocol": "ssh" or "telnet",
            "data": {
                "host": "hostname",
                "port": 22 or 23,
                "username": "username",  # Optional for telnet
                "password": "password"   # Optional for telnet
            }
        }
    
    2. Send data:
        {"type": "data", "data": "command or keystrokes"}
    
    3. Resize terminal:
        {"type": "resize", "data": {"cols": 80, "rows": 24}}
    """
    await websocket.accept()
    connection = None
    read_task = None

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message["type"] == "connect":
                protocol = message.get("protocol", "telnet")
                details = message["data"]
                
                try:
                    if protocol == "ssh":
                        print(f"Attempting SSH connection to {details['host']}:{details['port']}")
                        connection = SSHConnection(
                            websocket,
                            details["host"],
                            details["port"],
                            details["username"],
                            details["password"],
                        )
                        read_task = asyncio.create_task(connection.read_data())
                        print(f"SSH connection successful to {details['host']}")
                        
                    elif protocol == "telnet":
                        print(f"Attempting Telnet connection to {details['host']}:{details['port']}")
                        connection = TelnetConnection(
                            websocket,
                            details["host"],
                            details["port"],
                            details.get("username"),
                            details.get("password"),
                        )
                        await connection.connect()
                        read_task = asyncio.create_task(connection.read_data())
                        print(f"Telnet connection successful to {details['host']}")
                        
                    else:
                        raise Exception(f"Unsupported protocol: {protocol}")

                    await websocket.send_text(
                        json.dumps(
                            {"type": "connected", "data": "Successfully connected", "protocol": protocol}
                        )
                    )

                except Exception as e:
                    error_msg = f"Connection failed: {str(e)}"
                    print(f"{protocol.upper()} connection failed: {error_msg}")
                    traceback.print_exc()
                    await websocket.send_text(
                        json.dumps({"type": "error", "data": error_msg})
                    )
                    if connection:
                        connection.close()
                        connection = None

            elif message["type"] == "data" and connection:
                await connection.write_data(message["data"])

            elif message["type"] == "resize" and connection:
                data = message["data"]
                cols = data.get("cols", 80)
                rows = data.get("rows", 24)
                connection.resize_pty(cols, rows)

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        traceback.print_exc()
    finally:
        # Cleanup
        if read_task:
            read_task.cancel()
            try:
                await read_task
            except asyncio.CancelledError:
                pass
        if connection:
            connection.close()
            print("Connection closed")