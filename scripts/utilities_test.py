import sys
import pytest
import subprocess
from utilities import execute_command, get_local_flag, parse_wrangler_json

def test_execute_command_success(mocker):
  mock_run = mocker.patch("subprocess.run")
  mock_run.return_value = mocker.MagicMock(
    spec=subprocess.CompletedProcess,
    returncode=0,
    stdout="Process completed"
  )
  
  result = execute_command(["cat", "example.txt"])
  assert result.stdout == "Process completed"
  mock_run.assert_called_once_with(
    ["cat", "example.txt"], capture_output=True, text=True, check=False
  )

def test_execute_command_failed(mocker):
  mock_run = mocker.patch("subprocess.run")
  mock_run.return_value = mocker.MagicMock(
    spec=subprocess.CompletedProcess,
    returncode=1,
    stdout="Process completed",
    stderr="Process failed"
  )  
  mock_exit = mocker.patch("sys.exit")
  
  result = execute_command(["cat", "example.txt"])
  assert result is None
  mock_run.assert_called_once_with(
    ["cat", "example.txt"], capture_output=True, text=True, check=False
  )
  mock_exit.assert_called_once_with(1)
  
@pytest.mark.parametrize(
  "flag", ["--local", "--remote"]
)
def test_get_local_flag_success(mocker, flag):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", flag])
  result = get_local_flag()
  assert result == flag

def test_get_local_flag_failed(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", "--random"])
  mock_exit = mocker.patch("sys.exit")
  result = get_local_flag()
  assert result is None
  mock_exit.assert_called_once_with(1)
  
def test_get_local_flag_default(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md"])
  result = get_local_flag()
  assert result == "--local"

def test_parse_wrangler_json_success():
  output = parse_wrangler_json("""
wrangler x.xxx.x
───────────────────────────────────────────────
Resource location: local 

Use --remote if you want to access the remote instance.

🌀 Executing on local database test-db (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 1 command executed successfully.
[
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  }
]""")
  assert len(output) == 1
  assert output[0]["success"]
  assert len(output[0]["results"]) == 0
  assert output[0]["meta"]["duration"] == 0

def test_parse_wrangler_json_exception():
  with pytest.raises(ValueError, match="No JSON payload found in Wrangler stdout."):
    parse_wrangler_json("""
wrangler x.xxx.x
───────────────────────────────────────────────
Resource location: local 

Use --remote if you want to access the remote instance.

🌀 Executing on local database test-db (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 1 command executed successfully.""")
