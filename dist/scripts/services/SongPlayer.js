(function() {
    function SongPlayer(Fixtures) {
        var SongPlayer = {};
        
        /**
        *@function currentAlbum
        *@desc gets album information from the fixtures service
        *@param none
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        *@desc gets the index of a song from the album
        *@param {object} song
        *@returns index of song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        }
        
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        var currentBuzzObject = null;
        
        /**
        *@function playSong
        *@desc plays currentBuzzObject and sets the playing property of the song object to true
        *@param {object} song
        */
        var playSong = function(song) {
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
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            SongPlayer.currentSong = song;
        };
        
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                   playSong(song);
                }
            }
        };
        
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        *@desc sets the currentSong to the previous song in the album
        *@param {object} song
        */
        SongPlayer.previous = function(song) {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();