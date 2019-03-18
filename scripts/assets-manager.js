class AssetManager {

  constructor() {
    this.asset_entities = {};
  }

  addAsset(id, createAsset, pregenerate_amount ) {

    this.asset_entities[ id ] = {
      id: id,
      assets: [],
      createAsset: createAsset
    };

    var a = [];
    for( var i=0; i< pregenerate_amount; i++ ){
      a.push( this.pullAsset( id ) );
    }
    for( var i=0; i< a.length; i++ ){
      this.putAsset( a[i] );
    }
  }

  pullAsset(id) {
    var asset_obj = this.asset_entities[ id ];
    if( !asset_obj ) return undefined;

    var asset;
    
    if( asset_obj.assets.length ){
      asset = asset_obj.assets.pop();
    }else{
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