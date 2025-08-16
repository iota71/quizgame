from django.db import models

# Create your models here.

class Game(models.Model):
    
    name = models.CharField(max_length=100)
    
    image1 = models.ImageField(upload_to='game_images/', null=True, blank=True)
    image2 = models.ImageField(upload_to='game_images/', null=True, blank=True)
    image3 = models.ImageField(upload_to='game_images/', null=True, blank=True)
    image4 = models.ImageField(upload_to='game_images/', null=True, blank=True)
    image5 = models.ImageField(upload_to='game_images/', null=True, blank=True)
    
    hintDate = models.CharField(max_length=10, blank=True, null=True)
    hintDeveloper = models.CharField(max_length=50, blank=True, null=True)
    hintGenre = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    
    
    
    
