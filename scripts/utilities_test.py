import subprocess
from utilities import execute_command

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
