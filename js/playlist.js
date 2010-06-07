var playlist={}
playlist.add=function(url,title,add){
	var ct=1;
	playlist.db.transaction(
		function(tx) {
			tx.executeSql(
				"insert into histories(url,title,ct,timestamp) values(?,?,?,?)",
				[url,title,ct,(new Date).getTime()], null, 
				function(tx, error) {
					var sql;
					if(add){
						sql="update histories set ct=ct+1,timestamp=? where url=?"
						tx.executeSql(
							sql,
							[(new Date).getTime(),url], null, 
							function(tx, error) {
								alert(error.code+":"+error.message);
							} 
						); 
					}else{
						sql="update histories set timestamp=?,title=? where url=?"
					
						tx.executeSql(
							sql,
							[(new Date).getTime(),title,url], null, 
							function(tx, error) {
								alert(error.code+":"+error.message);
							} 
						);
					}
				} 
			); 
		}
	);
			
}
playlist.clear=function(){
	playlist.db.transaction(
		function(tx) {
			tx.executeSql(
				"delete from histories",
				[], null, 
				function(tx, error) {
					alert(error.code+":"+error.message);
				} 
			); 
		}
	);
}
playlist.del=function(url){
	playlist.db.transaction(
		function(tx) {
			tx.executeSql(
				"delete from histories where url=?",
				[url], null, 
				function(tx, error) {
					//alert(error.code+":"+error.message);
				} 
			); 
		}
	);
}
playlist.get = function(page,pageSize,callback){
	page = page?page:1;
	pageSize = pageSize?pageSize:16;
	
	var total;
	playlist.db.transaction(
		function(tx) {
			tx.executeSql(
				"select count(*) as c from histories",
				[], 
				function(tx, result) {
					total = result.rows.item(0)['c'];


					playlist.db.transaction(
						function(tx) {
							tx.executeSql(
								"select * from histories ORDER BY timestamp desc limit ? offset ?",
								[pageSize,(page-1)*pageSize], 
								function(tx, result) {
									var d= new Array();//[];
									for(var i = 0; i < result.rows.length; i++){
										d.push(result.rows.item(i));//['url']);
									}
									if(callback)callback({
										totalSize:total, 
										totalPage:Math.ceil(total/pageSize),
										page:page,
										pageSize:pageSize,
										items:d
									});
								},
								function(tx, error) {
									//alert(error.code+":"+error.message);
								}
							); 
						}
					);	


				},
				function(tx, error) {
					//alert(error.code+":"+error.message);
				}
			); 
		}
	);		
}
playlist.init = function(){
	if (window.openDatabase){
		// openDatabase(name, version, displayName, in unsigned long estimatedSize, in optional creationCallback);
		playlist.db =  openDatabase('youkutools', '', 'youkutools', 1024*1024, function (db) {
			db.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT COUNT(*) FROM histories",
						[], null, 
						function(tx, error) {
							tx.executeSql(
								"CREATE TABLE histories (url REAL UNIQUE, title TEXT, ct REAL, timestamp REAL)",
								[], null, null);
						} 
					); 
				}
			);
							
		});
	}
}
playlist.init();