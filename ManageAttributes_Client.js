var ManageAttributes = ManageAttributes || {};

/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/
/*** the FormIt application-side JS engine only supports ES5 syntax, so use var here ***/

ManageAttributes.setStringAttributeOnObjectFromInput = function(args) {

    var sAttributeKey = args.sAttributeKey;
    var sAttributeValue = args.sAttributeValue;
    var currentSelectionInfo = args.currentSelectionInfo;

    WSM.Utils.SetOrCreateStringAttributeForObject(currentSelectionInfo.nEditingHistoryID,
        currentSelectionInfo.aSelectedObjectIDs[0], sAttributeKey, sAttributeValue);
}