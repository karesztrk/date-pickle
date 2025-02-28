class CellStyleController {
  constructor(host) {
    this.host = host;
    host.addController(this);
  }
}
