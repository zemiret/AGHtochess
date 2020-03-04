from flask import Flask

def create_app():
    import core.models as models

    app = Flask(__name__)
    app.config.from_envvar('ATC_SETTINGS')

    app.teardown_appcontext(models.close_db)

    with app.app_context():
        from . import views
        from . import models

        # TODO: JUST A PLACEHOLDER !!!
        models.get_db().execute('DROP TABLE IF EXISTS User')
        models.get_db().execute('CREATE TABLE User(name)')

    return app



