import sys
from unittest.mock import MagicMock

def pytest_configure():
  sys.modules["casefy"] = MagicMock()
  sys.modules["dotenv"] = MagicMock()
  sys.modules["frontmatter"] = MagicMock()
