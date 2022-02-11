var ManageAttributes = ManageAttributes || {};

/*** the FormIt application-side JS engine only supports ES5 syntax, so use var here ***/

ManageAttributes.setStringAttributeOnHistoryFromInput = function(args) {

    var sAttributeKey = args.sAttributeKey;
    var sAttributeValue = args.sAttributeValue;
    var attributeInfo = args.attributeInfo;

    WSM.Utils.SetOrCreateStringAttributeForObject(attributeInfo.nEditingHistoryID,
        WSM.INVALID_ID, sAttributeKey, sAttributeValue);
}

ManageAttributes.setStringAttributeOnObjectFromInput = function(args) {

    var sAttributeKey = args.sAttributeKey;
    var sAttributeValue = args.sAttributeValue;
    var attributeInfo = args.attributeInfo;

    WSM.Utils.SetOrCreateStringAttributeForObject(attributeInfo.nEditingHistoryID,
        attributeInfo.nSelectedObjectID, sAttributeKey, sAttributeValue);
}

ManageAttributes.deleteStringAttribute = function(args)
{
    var nStringAttributeID = args.nStringAttributeID;
    var nHistoryID = FormIt.GroupEdit.GetEditingHistoryID();

    WSM.APIDeleteObject(nHistoryID, nStringAttributeID);
}