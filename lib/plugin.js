import './geo'

export default [{
    id: 'jupyterlab-geo-highlight',
    autoStart: true,
    activate: function(app) {
      console.log('JupyterLab extension jupyterlab-geo-highlight is activated!');
      console.log(app.commands);
      registerGeoFileType(app);
    }
}];

function registerGeoFileType(app) {
  app.docRegistry.addFileType({
    name: 'geo',
    displayName: 'Geo',
    extensions: ['geo'],
    mimeTypes: ['text/x-geo'],
  });
}
