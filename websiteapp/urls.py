from django.urls import path
from . import views

urlpatterns = [  
    path("", views.index),
    path("index", views.index),
    path("author", views.showAuthorName),
    path("welcome/<str:name>", views.showAnyName),
    path("quizgame", views.quizgame),
    path("quizgame/api/get-game", views.getGame, name="get-game"),
    path("quizgame/api/get-game-names", views.getAllGameNames, name="get-game-names"),
    path("quizgame/api/get-game-by-name", views.getGameByName, name="get-game-by-name"),
    
    ]
    
