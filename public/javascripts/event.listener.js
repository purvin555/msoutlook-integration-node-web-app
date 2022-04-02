class EventListener {
  constructor(name,callback) {    
    this.name = name;
    this.socket = io();
    this.notifyme = callback;
  }
  connect () {
    
    this.socket.on('connect',function() {
      console.log('Client has connected to the server!');
    });

    var messagereceived = function(data) {
      this.notifyme(data);
      console.log('Received a message from the server!',data);
    }.bind(this);

    this.socket.on(this.name,messagereceived);

    this.socket.on('disconnect',function() {
      console.log('The client has disconnected!');
    });
  }



  disconnect (){
    this.socket.disconnect();
  }
}

    //.connect();//.Socket();
    //socket.connect('http://localhost:3000'); 
