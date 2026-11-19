"""
Reuses the same JWT the Node.js backend issues.
Validates Bearer token and returns user_id.
"""
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

bearer_scheme = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")
ALGORITHMS = ["HS256"]


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=ALGORITHMS)
        user_id: str = payload.get("id") or payload.get("userId") or payload.get("sub") or payload.get("_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {e}",
        )
