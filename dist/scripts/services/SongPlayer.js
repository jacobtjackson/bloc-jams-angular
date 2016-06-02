(function() {
    function SongPlayer($rootScope, Fixtures) {
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
        };
        
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
        /**
        *@attribute 
        *@desc sets the currentBuzzObject to null. 
        */
        var currentBuzzObject = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        *@attribute SongPlayer.volume
        *@desc sets the volume to 100%
        *@type {value}
        */
        SongPlayer.volume = 100;
        
        /**
        *@desc stops the current song playing and sets the song playing to null
        *@type {function}
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }
        
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

            /**
            * @function currentBuzzObject.bind
            * @desc Adds an event listener to the Buzz sound object to listen for a timeupdate event
            */
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };
        
        /**
        @function SongPlayer.play
        @desc registers the user clicking play, sets the song as current song and plays it if it isn't already current song, plays it if it is.
        @params {object} song
        */
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
        
        /**
        @function SongPlayer.pause
        @desc registers the user clicking pause and pauses the song
        @params {object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        @function SongPlayer.previous
        @desc registers the user clicking previous, sets the song as the last song or stops it if it's the first song in currentAlbum
        @params {object} song
        */
        SongPlayer.previous = function(song) {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        *@desc sets the current song to the next song in the album
        *@param {object} song
        */
        SongPlayer.next = function(song) {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex >= currentAlbum.songs.length) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        *@function setCurrentTime
        *@desc set current time (in seconds) of currently playing song
        *@param {number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        /**
        *@function setVolume
        *@desc set volume of currently playing song
        *@param {number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();