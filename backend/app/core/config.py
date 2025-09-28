from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Dopamine Hunter API"
    version: str = "1.0.0"
    debug: bool = False
    
    # API settings
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = ["*"]
    
    # Database settings (for future use)
    database_url: str | None = None
    database_type: str = "memory"  # memory, file, postgresql
    
    # Logging settings
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
