class AssetManager {

  constructor() {
    this.asset_entities = {};
  }

  addAsset(id, createAsset, pregenerate_amount ) {
    if ( !this.asset_entities[ id ] ) {
      this.asset_entities[ id ] = {
        id: id,
        assets: [],
        createAsset: createAsset
      };
    } else {
      var assets = this.asset_entities[ id ].assets;
      this.asset_entities[ id ] = {
        id: id,
        assets: assets,
        createAsset: createAsset
      }
    }
    
    var a = [];
    for( var i=0; i< pregenerate_amount; i++ ){
      a.push( this.pullAsset( id, true ) );
    }
    for( var i=0; i< a.length; i++ ){
      this.putAsset( a[i] );
    }
  }

  pullAsset(id, adding) {

    var asset_obj = this.asset_entities[ id ];
    if( !asset_obj ) return undefined;

    var asset;
    
    if( asset_obj.assets.length && !adding){
      asset = asset_obj.assets.pop();
    } else {
      asset = asset_obj.createAsset();
      asset._asset_id = id; 
    }

    return asset;
  }
  
  putAsset(asset) {

    var asset_obj = this.asset_entities[ asset._asset_id ];
    if( !asset_obj ) return undefined;

    asset_obj.assets.push( asset );

  }

}