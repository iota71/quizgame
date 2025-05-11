from django.shortcuts import render
from django.http.response import HttpResponse
from django.http import JsonResponse
from .models import Game
import random
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def index(request):
    return render(request, "websiteapp/index.html")

def showAuthorName(request):
    return HttpResponse("Bu site Furkan Parlak tarafından yapılmıştır.")

def showAnyName(request, name):
    return HttpResponse(f"Hoş geldin {name}")

def quizgame(request):
    
    return render(request, "websiteapp/quizgame.html")

@csrf_exempt

def getGame(request):
    
    playedGames = []
    
    if request.method == "POST":
        body_unicode = request.body.decode("utf-8")
        body_data = json.loads(body_unicode)
        playedGames = body_data.get("playedGames", [])
        playedGames = [name.lower() for name in playedGames]
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
        
    games = Game.objects.all()
    
    availableGames =  [game for game in games if game.name.lower() not in playedGames]
    
    if not availableGames:
        return JsonResponse({"error": "Tüm oyunlar oynandı!"}, status=400)
    
    game = random.choice(availableGames)
    
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
    
    game_names = list(Game.objects.all().order_by('name').values_list("name", flat=True))
    
    return JsonResponse({"games": game_names})

    

    
