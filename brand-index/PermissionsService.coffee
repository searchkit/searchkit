permissions = require("./permissions")
_ = require("lodash")

module.exports = new class PermissionService

	constructor:()->
		@permissionsIndex = {}
		@index()
		
	index:()->
		@permissionsIndex = _.chain(permissions)
			.map(_.partialRight(_.pick, ["group_id", "pathFolderIDs"]))
			.groupBy("group_id")
			.mapValues (values)=>
				_.flatten(_.pluck(values, "pathFolderIDs"))				
			.value()
			
		console.log(@permissionsIndex)
		
	makeQuery:(groupId)->
		folders = @permissionsIndex[groupId]
		unless folders 
			return undefined
		
		return {
			"bool" : {
				"filter" : {
						"terms" : { 
							"pathFolderIds" :folders 							
							"execution":"or"
						}
				}
			}
		}
	
			
		

	