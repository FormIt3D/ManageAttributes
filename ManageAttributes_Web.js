window.ManageAttributes = window.ManageAttributes || {};

/*** web/UI code - runs natively in the plugin process ***/

// similar to Properties Plus, specify a max amount of objects the UI responds to
ManageAttributes.nMaxObjectCount = 1000;

// elements that get updated on selection and context change
ManageAttributes.editingHistoryInfoCard = undefined;
ManageAttributes.existingAttributesOnHistoryCard = undefined;
ManageAttributes.newAttributeOnHistoryCard = undefined;
ManageAttributes.notInEditingContextMessageCard = undefined;

ManageAttributes.selectionCountInfoCard = undefined;
ManageAttributes.existingAttributesOnSelectionCard = undefined;
ManageAttributes.newAttributeOnSelectionCard = undefined;
ManageAttributes.incompatibleSelectionMessageCard = undefined;

// initialize the UI
ManageAttributes.initializeUI = function()
{
    // create a container for all UI elements that should show
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer';
    window.document.body.appendChild(contentContainer);

    // create the overall header
    let headerContainer = new FormIt.PluginUI.HeaderModule('Manage Attributes', 'View, modify, and add string attributes to the current history or the selected object.', 'headerContainer');
    contentContainer.appendChild(headerContainer.element);

    /*** in editing history ***/

    // editing context section
    let currentHistoryAttributesHeader = new FormIt.PluginUI.SubheaderModule('In Editing History');
    contentContainer.appendChild(currentHistoryAttributesHeader.element);

    // context properties info card
    //ManageAttributes.editingHistoryInfoCard = new FormIt.PluginUI.EditingContextInfoCard();
    //contentContainer.appendChild(ManageAttributes.editingHistoryInfoCard.element);

    // message when no group is being edited - attributes can't be added here
    ManageAttributes.notInEditingContextMessageCard = new FormIt.PluginUI.MessageInfoCard('Edit a group to manage its history attributes.');
    contentContainer.appendChild(ManageAttributes.notInEditingContextMessageCard.element);
    ManageAttributes.notInEditingContextMessageCard.hide();

    // existing attributes on this history
    ManageAttributes.existingAttributesOnHistoryCard = new FormIt.PluginUI.StringAttributeListViewOnly('History Attributes', false, 200);
    contentContainer.appendChild(ManageAttributes.existingAttributesOnHistoryCard.element);

    // create new attributes on this history
    ManageAttributes.newAttributeOnHistoryCard = new FormIt.PluginUI.NewStringAttributeInfoCard('Add New Attribute', false, 200);
    contentContainer.appendChild(ManageAttributes.newAttributeOnHistoryCard.element);

    /*** on selected object ***/

    // selected object section
    let selectedObjectAttributesHeader = new FormIt.PluginUI.SubheaderModule('On Selected Object');
    contentContainer.appendChild(selectedObjectAttributesHeader.element);

    // selection count info card
    ManageAttributes.selectionCountInfoCard = new FormIt.PluginUI.SelectionCountInfoCard(ManageAttributes.nMaxObjectCount);
    contentContainer.appendChild(ManageAttributes.selectionCountInfoCard.element);
    // append the too many objects div now that it has a parent
    ManageAttributes.selectionCountInfoCard.appendTooManyObjectsMessage();

    // message when the selection doesn't contain a single object
    ManageAttributes.incompatibleSelectionMessageCard = new FormIt.PluginUI.MessageInfoCard('Select a single object to manage its attributes.');
    contentContainer.appendChild(ManageAttributes.incompatibleSelectionMessageCard.element);
    ManageAttributes.incompatibleSelectionMessageCard.hide();

    // existing attributes on this object
    ManageAttributes.existingAttributesOnSelectionCard = new FormIt.PluginUI.StringAttributeListViewOnly('Object Attributes', true, 200);
    contentContainer.appendChild(ManageAttributes.existingAttributesOnSelectionCard.element);

    // create new attributes on this history
    ManageAttributes.newAttributeOnSelectionCard = new FormIt.PluginUI.NewStringAttributeInfoCard('Add New Attribute', true, 200);
    contentContainer.appendChild(ManageAttributes.newAttributeOnSelectionCard.element);
    ManageAttributes.newAttributeOnSelectionCard.submitNewStringAttribute.button.addEventListener('click', function()
    {
        ManageAttributes.newAttributeOnSelectionCard.submitStringAttributeOnObject(ManageAttributes.existingAttributesOnSelectionCard);
    });

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the UI
ManageAttributes.updateUI = function()
{
    // get general selection info from Properties Plus
    window.FormItInterface.CallMethod("PropertiesPlus.getSelectionInfo", { }, function(result)
    {
        let currentSelectionInfo = JSON.parse(result);

        // update the cards that are always shown
        //ManageAttributes.editingHistoryInfoCard.update(currentSelectionInfo);
        ManageAttributes.selectionCountInfoCard.update(currentSelectionInfo);


    });

    // get attribute info from Properties Plus
    window.FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", { }, function(result)
    {
        let attributeInfo = JSON.parse(result);

        // update the lists of existing attributes
        ManageAttributes.existingAttributesOnSelectionCard.update(attributeInfo.aSelectedObjectStringAttributes);
        ManageAttributes.existingAttributesOnHistoryCard.update(attributeInfo.aSelectedObjectHistoryStringAttributes);

        // manage card visibility for the editing history section

        // history attributes shouldn't be applied to the Main History (0)
        if (attributeInfo.nEditingHistoryID == 0)
        {
            ManageAttributes.notInEditingContextMessageCard.show();
            ManageAttributes.existingAttributesOnHistoryCard.hide();
            ManageAttributes.newAttributeOnHistoryCard.hide();
        }
        else
        {
            ManageAttributes.notInEditingContextMessageCard.hide();
            ManageAttributes.existingAttributesOnHistoryCard.show();
            ManageAttributes.newAttributeOnHistoryCard.show();
        }

        // manage card visibility for the selected object section

        // attributes can only be managed on a single item at a time
        if (attributeInfo.nSelectedTotalCount == 1)
        {
            ManageAttributes.incompatibleSelectionMessageCard.hide();
            ManageAttributes.existingAttributesOnSelectionCard.show();
            ManageAttributes.newAttributeOnSelectionCard.show();
        }
        else 
        {
            ManageAttributes.incompatibleSelectionMessageCard.show();
            ManageAttributes.existingAttributesOnSelectionCard.hide();
            ManageAttributes.newAttributeOnSelectionCard.hide();
        }
    });


}