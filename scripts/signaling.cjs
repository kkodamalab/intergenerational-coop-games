// Local validation only. Production uses the public PeerJS signaling service.
require('peer').PeerServer({port:9000,path:'/peerjs'});
