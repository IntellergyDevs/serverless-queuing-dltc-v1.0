# test_script.py
import subprocess

def test_script_runs():
    result = subprocess.run(["python", "app.py"], capture_output=True, text=True)
    assert result.returncode == 0, f"Script failed with output: {result.stdout}"
    assert "Hello, this is a simple Python script!" in result.stdout, "Output doesn't match expected message."

if __name__ == "__main__":
    test_script_runs()
