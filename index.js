var game = new Phaser.Game(256,240);


//score krataei to score, kai to scoreText to text pu emfanizete
var score = 0;
var scoreText;
//leiturgei san diakopths gia to keyboard
var enableKeyboard = true;
/*leitourgei san diakopths otan thelw na kanw to animation
 *gia to end of level */
var goRight = false;
//h zwh tu player kai to text pu emfanizete
game.life = 3;
var lifeText;
//to player.x position tu paikth kai to text p to emfanizei
var posX = 0;
var posXText;

/*o sthlos me th shmaia sto telos
 *thn ekana global gia na mporei na exei access
  h endLevelOverlap function*/
var flagpole;

//pinakas pu leei se poia shmeia tu super_mario_tiles.png einai ta solid tiles
var solidArray = [7,8,9,10,15,16,22,23,25,26,27,32,33,34];

var mainState = {
	
    
    create: function() {
        
		//Dhmiourgia scoreText sth ariterh panw gwnia thw othonis
		scoreText = game.add.text(12, 12, 'score: 0', { fontSize: '12px', fill: '#000' });
		//To scoreText akoluthaei th camera
		scoreText.fixedToCamera = true;
		lifeText = game.add.text(200, 12, 'Lives: 3', { fontSize: '12px', fill: '#000' });
		//To scoreText akoluthaei th camera
		lifeText.fixedToCamera = true;
	 
	    game.gameSound = game.add.audio('gameSound');
	    game.gameSound.play();
	    
	    
	    game.levelComplete = game.add.audio('levelComplete');
	    
	    
    	map = game.add.tilemap('level');
		//map.addTilesetImage('tiles', 'tiles');
		map.addTilesetImage("tiles", "tiles", 112, 112, 0, 0);
		/*map.setCollisionBetween(3, 12, true, 'solid');*/
		map.setCollision(solidArray, true, 'solid');
		map.createLayer('background');
		
		layer = map.createLayer('solid');
		layer.resizeWorld();
		
		
		coins = game.add.group();
		coins.enableBody = true;
		
		teleport = game.add.group();
		teleport.enableBody = true;
		map.createFromTiles(5, null, 'empty', 'teleport', teleport);
		
		
		
		flagpole = game.add.group();
		flagpole.enableBody = true;
		map.createFromTiles(11, null, 'flagpole', 'stuff', flagpole);
		
		
		
		//vazw to bonus sto group autu tu instance
		bonus = game.add.group();
		bonus.enableBody = true;
		
		
		map.createFromTiles(2, null, 'coin', 'stuff', coins);
			
		//Dhmiourgia bonus tile apo to map data
		//kai loading sprite 3 opu einai kai to bonus sprite apo
		//to super_mario_tiles.png
		map.createFromTiles(3, null, 'bonus', 'stuff', bonus);
	
		
		/*Από coins.callAll(...) [0, 0, 1, 2] σε [ 0, 0, 1, 2, 3, 4, 5, 6, 7 ] 
		  Αφού το αρχείο coin2 έχει 8 tiles αντί για 3. */
		coins.callAll('animations.add', 'animations', 'spin',
				[ 0, 0, 1, 2, 3, 4, 5, 6, 7 ], 6, true);
		
		coins.callAll('animations.play', 'animations', 'spin');
		goombas = game.add.group();
		goombas.enableBody = true;
		map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
		goombas.callAll('animations.add', 'animations', 'walk', [ 0, 1 ],
				2, true);
		goombas.callAll('animations.play', 'animations', 'walk');
		goombas.setAll('body.bounce.x', 1);
		goombas.setAll('body.velocity.x', -20);
		goombas.setAll('body.gravity.y', 500);
		
		turtles = game.add.group();
		turtles.enableBody = true;
		map.createFromTiles(24, null, 'turtle', 'stuff', turtles);
		turtles.callAll('animations.add', 'animations', 'walk', [ 0, 0],
				0, true);
		turtles.callAll('animations.play', 'animations', 'walk');
		turtles.setAll('body.bounce.x', 1);
		turtles.setAll('body.velocity.x', -60);
		turtles.setAll('body.gravity.y', 500);
	
		
		
		player = game.add.sprite(16, game.world.height - 48, 'mario');
		game.physics.arcade.enable(player);
		player.body.gravity.y = 370;
		player.body.collideWorldBounds = true;
		player.animations.add('walkRight', [ 1, 2, 3 ], 10, true);
		player.animations.add('walkLeft', [ 7, 8, 9 ], 10, true);
		player.goesRight = true;

		game.camera.follow(player);

		cursors = game.input.keyboard.createCursorKeys();
		
		//Thetei th thesh pu exei oristh sto menu State
		player.x = posX;
		
    },
    
    update: function() {
        
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(goombas, layer);
		game.physics.arcade.collide(turtles, layer);
		
		game.physics.arcade.overlap(player, goombas, this.goombaOverlap);
		game.physics.arcade.overlap(player, coins, this.coinOverlap);
		game.physics.arcade.overlap(player, turtles, this.turtleOverlap);
		//symperilamvano sta physics to player kai to bonus
		//kai thn function bonusOverlap gia response se periptwsh overlap
		game.physics.arcade.overlap(player, bonus, this.bonusOverlap);
		game.physics.arcade.overlap(player, teleport, this.teleportOverlap);
		
		game.physics.arcade.overlap(player, flagpole, this.endLevelOverlap);
		
		
		scoreText.bringToTop();
		lifeText.bringToTop();
		
		
		//to enableKeyboard mporei na stamathsh to userinput 
		if (player.body.enable && enableKeyboard) {
				player.body.velocity.x = 0;
				if (cursors.left.isDown) {
					player.body.velocity.x = -90;
					player.animations.play('walkLeft');
					player.goesRight = false;
				} else if (cursors.right.isDown) {
					player.body.velocity.x = 90;
					player.animations.play('walkRight');
					player.goesRight = true;
				} else {
					player.animations.stop();
					if (player.goesRight)
						player.frame = 0;
					else
						player.frame = 7;
				}
				if (cursors.up.isDown && player.body.onFloor()) {
					player.body.velocity.y = -190;
					player.animations.stop();
					game.sound.play('jumpSound');
					
				}
				
				
				if (player.body.velocity.y != 0) {
					if (player.goesRight)
						player.frame = 5;
					else
						player.frame = 12;
				}
			}
			
			/*H goRight ginete true otan ginei overlap me to flagpole
			 * gia na ginei to animation tu player kai na paei sth epomenh pista */
			if (goRight) {
				
				
				/*Otan to player.y ftasei meta to 152 shmainei oti
				 *kai o paikths exei katevh olo to flagpole 
				  ara dhmiourgei th kinhsh pros to kastro (deksia)*/
				if(player.y >= 152) {
					player.body.velocity.x = 30;
					player.animations.play('walkRight');
					
				}	
				
			
				/*Kapoia stigmh o paikths prepei na stamathsh. 
				 *Otan ftasei to player.x >= 2090(mprosta apo th eisodo tu kastrou) 
				 *o paikths stamataei kai an exei stamathsh kai h musikh to levelComplete 
				 *tote ton pernaei sto epomeno level */
				if( (player.x >= 2090 && player.x <= 2094)) {
					player.body.velocity.x = 0;
					player.frame = 0;
					player.animations.stop();
					
					if(!game.levelComplete.isPlaying) {
					
					goRight = false;
					enableKeyboard = true;
					player.body.gravity.y = 390;
					player.x = 3100;
					
					}
					
				}
				
			}
		
    },
    
    goombaOverlap: function(player, goomba) {
    	if(player.body.touching.down) {
	    	
	    	score += 5;
			scoreText.text = 'Score: ' + score;
    	
    		game.sound.play('lostLifeSound');
			goomba.animations.stop();
			goomba.frame = 2;
    	
    		goomba.body.enable = false;
			player.body.velocity.y = -80;
			game.time.events.add(Phaser.Timer.SECOND, function() {
				goomba.kill();
			});
    		
    		
    	} else {
				//otan ginete overlap player se goomba
				//paizei to goombaDeathSound
				game.sound.play('goombaDeathSound');
				goomba.animations.stop();
				goomba.frame = 2;
				
				goomba.body.enable = false;
				player.body.velocity.y = -80;
				game.time.events.add(Phaser.Timer.SECOND, function() {
					goomba.kill();
				});
				game.life--;
				lifeText.text = 'Lives: ' + game.life;
				
				
				/*Otan o paikths pethanei, kalhte h hadleDeath function*/
				
				if(game.life == 0) {
					mainState.handleDeath(player);
				}
			}    	
    },
	/*An to player kanei overlap me turtle tote o player 
	 *pethenei apeutheias  xwris na xasei zwh */
	turtleOverlap: function(player, turtle) {
		turtle.kill();
		game.sound.play('lostLifeSound');
		mainState.handleDeath(player);
	},
	
	/*Otan o player pethenei tote stamataei na paizei to gameSound
	 *kai paizei to deathSound
	 *sth synexeia ksekinaei to gameOver state 
	 */
	handleDeath: function(player) {
		game.gameSound.destroy();
		game.sound.play('deathSound');
		player.frame = 6;
		player.body.enable = false;
		
		player.animations.stop();
			game.time.events.add(Phaser.Timer.SECOND * 3, function() {
				game.state.start('gameOver');
			});
	},
	
	coinOverlap: function(player, coin) {
		coin.kill();
		game.sound.play('coinSound');
		score += 1;
		scoreText.text = 'Score: ' + score;
	},
	
	bonusOverlap: function(player, bonus) {
		//paikse to bonusLifeSound
		
		game.sound.play('bonusLifeSound');
		//Remove bonus sprite
		bonus.kill();
		//aukshsh ths zwhs kata 1
		game.life++;
		lifeText.text = 'Lives: ' + game.life;
		
	},
	/*To teleport einai ena sprite to opoio einai aorato kai vriskete
	 * akrivws panw apo tus prasinus swlhnes, etsi wste otan ginei overlap na trexei
	 * auth h methodos*/
	teleportOverlap: function(player, teleport) {
		
			
					cursors = game.input.keyboard.createCursorKeys();
					/*Oi syntetagmes 674<=x<=717 kai y = 144 antistoixun sto prwto pipe tu xarth*/
					
					/*An paththei to katw velaki kai o player einai panw apo pipe tote tha ginei teleport 
					 *se ena shmeio tu xarth (coin dungeon)
					 */
					if((player.x >= 674.0 && player.x <= 717.0) && player.y == 144) {
					
						if(cursors.down.isDown) {
							player.y = 144;
							player.x = 2570;
						}
						
												
					} else if( (player.x >= 2530.0 && player.x <= 2673.0) && player.y == 160) {
					/*Oi syntetagmes 2530<=x<=2673 kai y = 160 antistoixun sto deutero pipe tu xarth*/
						if(cursors.down.isDown) {
							player.y = 112;
							player.x = 688;
						}
						
					}	
				
	},
	/* h endLevelOverlap kaleite otan ginei overlap player me flagpole 
	 * kai dhmiourgei to animation tu player gia to end of level mesa apo to
	 * goRight flag/switch sth update function
	 */
	endLevelOverlap: function(player) {
	
		game.gameSound.destroy();
		game.levelComplete.play();
		/*Afu ginei overlap me opoiodhpote shmeio tu flagpole 
		 *tote katastrepse ola ta tiles tu. 
		 *Akoma kai na katastrafun shnexizun na emfanizonte giati exw
		 *ftiaksei sto json arxeio ta flagpoles KAI san background 
		 *ektos apo stuff's */
		 
		flagpole.callAll("kill");
		enableKeyboard = false;
		player.animations.stop();
		player.body.gravity.y = 9;
		player.body.velocity.y = 20;
		player.body.velocity.x = 0;
		//Kata th diarkeia pu peftei o player, meine se sygkekrimeno x
		player.x = 1980;
		goRight = true;
		
	
		
	},
	
	
	
    
    
};


/* Auto to state einai ypeythino gia th epilogh tu level
 * kai gia na arxisei h main function
 */
var menuState = {

	create: function() {
		
	
		var playText = game.add.text(70,120,
	    'Press SPACE to Play',
	        {
	            font: '18px Arial',
	            fill: '#fff',
	            align: 'center'
	        }
	    );
	    
	    var selectLevelA = game.add.text(70,150,
	    'Press A for level A',
	        {
	            font: '18px Arial',
	            fill: '#fff',
	            align: 'center'
	        }
	    );
	    
	    var selectLevelB = game.add.text(70,180,
	    'Press B for level B',
	        {
	            font: '18px Arial',
	            fill: '#fff',
	            align: 'center'
	        }
	    );
	    
	    posXText = game.add.text(12, 12, 'Level Selected: none',
	    { fontSize: '12px', fill: '#000' });
		
		this.spacebar = this.game.input.keyboard.
        addKey(Phaser.Keyboard.SPACEBAR);
        
        this.A = this.game.input.keyboard.
        addKey(Phaser.Keyboard.A);
        
        this.B = this.game.input.keyboard.
        addKey(Phaser.Keyboard.B);
        
	},
	
	
	update: function() {
		 if(this.spacebar.isDown) {
                game.state.start('main');
            }
            
         if(this.A.isDown) {
         		posX = 0;
         		this.selectedLevel();
         }
         
         if(this.B.isDown) {
         		posX = 3100;
         		this.selectedLevel();
         }
         
	},
	selectedLevel: function() {
		if(posX == 0) {
			posXText.text = "Level Selected: A";
		} else if(posX == 3100) {
			posXText.text = "Level Selected: B";
		}
		
	}
	
	
};

/* kaleite otan pethenei o player.
 * Dinei th dinatothta sto xrhsth na kanei restart to
 * paixnidi girnontas ton sto menu State
 */
var gameOverState = {
	create: function() {
	var label = game.add.text(128,120,
    'GAME OVER \nPress SPACE to restart',
        {
            font: '18px Arial',
            fill: '#fff',
            align: 'center'
        }
    );
    
    label.anchor.setTo(0.5, 0.5);
    
    this.spacebar = this.game.input.keyboard.
    addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    update: function() {
        if(this.spacebar.isDown) {
            game.state.start('menu');
        }
    }
};


/* Kanei load ola ta simantika arxeia kai parametrus 
*/
var loadState = {
	preload: function() {
		this.load.spritesheet('button', 'assets/buttons.png', 64, 16);
	
		this.load.audio('coinSound', 'audio/coin.wav');
		this.load.audio('jumpSound', 'audio/jump.wav');
		this.load.audio('deathSound', 'audio/death.wav');
		this.load.audio('goombaDeathSound', 'audio/stomp.wav');
		game.load.audio('gameSound', 'audio/gameTheme.wav');
		game.load.audio('levelComplete' , 'audio/levelComplete.wav');
		this.load.audio('lostLifeSound' , 'audio/bump.wav');
		this.load.audio('bonusLifeSound', 'audio/bonusLife.wav');
		
		
		this.load.spritesheet('tiles', 'assets/super_mario_tiles.png', 16, 16);
		this.load.spritesheet('goomba', 'assets/goomba.png', 16, 16);
		this.load.spritesheet('turtle', 'assets/turtle.png', 16, 16);
		//Προσαρμογή των arguments σε καινούργια δεδομένα
		this.load.spritesheet('mario', 'assets/ash.png', 16, 16, 13);
		this.load.spritesheet('coin', 'assets/coin2.png', 16, 16);
		//loading sprite bonus.png
		this.load.spritesheet('bonus', 'assets/bonus.png', 16, 16);
		this.load.spritesheet('empty', 'assets/empty.png', 16,16);
		this.load.spritesheet('flagpole', 'assets/flagpole.png', 16,16);
		this.load.tilemap('level', 'assets/super_mario_map15.json', null,
				Phaser.Tilemap.TILED_JSON);
	},
	
	create: function() {
		Phaser.Canvas.setImageRenderingCrisp(game.canvas)
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = '#5c94fc';
		
		
		
		//mpainw sto menu State
		game.state.start('menu');
	}
}

/*Kanei load ta shmantika arxeia.
 *To xrhshmopoio kyriws gia pio katharo kwdika*/
game.state.add('load', loadState);

/*To menu pu emfanizete sth arxh t paixnidiu */
game.state.add('menu', menuState);

/*Olh h logikh tu paixnidiou*/
game.state.add('main', mainState);

/*To gameOver pu emfanizete otan o paikths pethenei*/
game.state.add('gameOver', gameOverState);

/*H phaser ksekinaei me to load state*/
game.state.start('load');