var createGame = require('voxel-engine')
var highlight = require('voxel-highlight')
var player = require('voxel-player')
var voxel = require('voxel')
var extend = require('extend')

var createTerrain = require('voxel-perlin-terrain');

var playerPhysics = require('player-physics')


module.exports = function(opts, setup) {
  // setup the game and add some trees
  var game = createGame({
    //generateVoxelChunk: createTerrain(2,32),
    generate: function(x, y, z) {
      if(y > 20) return 0
      else if(y> 14) return 1
      else if(y> 3) return 3
      else return 4
    },
    chunkDistance: 2,
    materials: [
      ['grass_top', 'dirt', 'grass_side'],
      'gravel',
      'stone',
      'bedrock',
      'wood',
      'brick'
    ],
    texturePath: '/textures/crayoncraft/textures/blocks/',
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    lightsDisabled: false,
    fogDisabled: false,
    generateChunks: true,
    mesher: voxel.meshers.greedy,
    playerHeight: 1.62
  })
  var createPlayer = player(game)

  window.game = game // for debugging
  var container = document.body

  game.appendTo(container)

  // create the player from a minecraft skin file and tell the
  // game to use it as the main player
  var avatar = createPlayer('player.png')
  avatar.possess()
  avatar.yaw.position.set(2, 50, 4)

  defaultSetup(game, avatar)
  //game.controlling.removeForce(game.gravity)  //FLY!
  return game

}

function defaultSetup(game, avatar) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })

  window.addEventListener('keydown', function (ev) {
    // toggle between first and third person modes
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()

    // toggle fly mode
    // TODO: make it not suck
    else if (ev.keyCode === 'G'.charCodeAt(0)) {
      avatar.toggleFlight()
    }
  })

  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
    }
    else {
      position = blockPosErase
      if (position) game.setBlock(position, 0)
    }
  })

}
