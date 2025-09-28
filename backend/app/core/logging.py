"""Logging configuration for the Dopamine Hunter application"""

import logging
import sys
from .config import settings

def setup_logging():
    """Setup application logging configuration"""
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Setup console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.log_level.upper()))
    root_logger.addHandler(console_handler)
    
    # Setup application logger
    app_logger = logging.getLogger("dopamine_hunter")
    app_logger.setLevel(getattr(logging, settings.log_level.upper()))
    
    return app_logger

# Initialize logging
logger = setup_logging()
