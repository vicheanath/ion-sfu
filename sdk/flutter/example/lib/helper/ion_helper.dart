import 'package:events2/events2.dart';
import 'package:flutter_ion/flutter_ion.dart';

class IonHelper extends EventEmitter {
  Client _client;
  String _rid;

  get client => _client;

  get roomId => _rid;

  connect(host) async {
    if (_client == null) {
      var url = 'https://$host:8443/ws';
      _client = Client(url);

      _client.on('transport-open', () {
        this.emit('transport-open');
      });
    }

    await _client.connect();
  }

  join(String roomId) async {
    this._rid = roomId;
    await _client.join(roomId, {'name': 'Guest'});
    this.emit('join');
  }

  close() async {
    if (_client != null) {
      await _client.leave();
      _client.close();
      _client = null;
    }
  }
}
