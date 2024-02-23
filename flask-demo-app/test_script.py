import subprocess

def test_script_runs():
    result = subprocess.run(["python", "flask-demo-app/app.py"], capture_output=True, text=True)

    # Print the stdout and stderr for debugging purposes
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

    assert result.returncode == 0, f"Script failed with output: {result.stdout}"

if __name__ == "__main__":
    test_script_runs()
