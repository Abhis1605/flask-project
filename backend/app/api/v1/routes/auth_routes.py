from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from flask_login import (
    login_user,
    logout_user,
    login_required,
)

from app.services.auth_service import AuthService

auth_bp = Blueprint(
    'auth',
    __name__,
    url_prefix='/api/v1/auth'
)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        
        success, message = AuthService.register(
            request.form
        )
        
        if success:
            flash(message, 'success')
            
            return redirect(
                url_for('auth.login')
            )
            
        flash(message, 'danger')
        
    return render_template(
        'auth/register.html'
    )

@auth_bp.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        
        data = {
            "email": request.form.get("email"),
            "password": request.form.get("password")
        }
        
        result = AuthService.login(data)
        
        if result["success"]:
            login_user(result["user"])
            
            flash(result["message"], "success")
            
            next_page = request.args.get("next")

            return redirect(next_page or url_for("home.home"))

        flash(result["message"], "danger")
    
    return render_template('auth/login.html')

@auth_bp.route("/logout")
@login_required
def logout():

    logout_user()

    flash(
        "Logged out successfully.",
        "success"
    )

    return redirect(
        url_for("auth.login")
    )