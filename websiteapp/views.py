from django.shortcuts import render
from django.http.response import HttpResponse
from django.http import JsonResponse
from .models import Game
import random

# Create your views here.

def index(request):
    return render(request, "websiteapp/index.html")

def showAuthorName(request):
    return HttpResponse("Bu site Furkan Parlak tarafından yapılmıştır.")

def showAnyName(request, name):
    return HttpResponse(f"Hoş geldin {name}")

def quizgame(request):
    
    return render(request, "websiteapp/quizgame.html")

def getGame(request):
    
    game =  random.choice(Game.objects.all())
    
    data = {
        
        "image1": game.image1.url,
        "image2": game.image2.url,
        "image3": game.image3.url,
        "image4": game.image4.url,
        "image5": game.image5.url,
        "name": game.name,                
    }
    
    return JsonResponse(data)

def getAllGameNames(request):
    
    game_names = list(Game.objects.values_list("name", flat=True))
    
    return JsonResponse({"games": game_names})


    
    
    
    

    
