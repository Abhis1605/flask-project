import re

class ValidationError(Exception):
    pass

def validate_name(name: str):
    
    name = name.strip()
    
    if len(name) < 5:
        raise ValidationError(
            'Full name must contain at least 5 characters.'
        )
        
    return name

def validate_email(email: str):
    
    email = email.strip().lower()
    
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    
    if not re.match(pattern, email):
        raise ValidationError(
            'Please enter a valid email address.'
        )
        
    return email

def validate_password(password: str):
    
    if len(password) < 8 :
        raise ValidationError(
            "Password must contain at least 8 characters."
        )
        
    return password