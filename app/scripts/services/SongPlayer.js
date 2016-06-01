(function() {
    function SongPlayer() {
        var SongPlayer = {};
        
        var currentSong = null;
        
        
        var currentBuzzObject = null;
        
        /**
        *@function playSong
        *@desc plays currentBuzzObject and sets the playing property of the song object to true
        *@param {object} song
        */
        var playSong = function(song) {
            setSong(song);
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        *@function setSong
        *@desc stops currently playing song and loads new audio file as currentBuzzObject
        *@param {object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentSong = song;
        };
        
        SongPlayer.play = function(song) {
            if (currentSong !== song) {
                playSong(song);
            } else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };
        
        SongPlayer.pause = function(song) {
            currentBuzzObject.pause();
            song.playing = false;
        };
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();