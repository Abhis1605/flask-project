from app.models import Product, Category

class HomeService:
    
    @staticmethod
    def get_dashboard(current_user):
        
        return {
            "user": current_user.to_dict(),
            "stats": {
                "total_products": Product.query.count(),
                "total_categories": Category.query.count()
            }
        }