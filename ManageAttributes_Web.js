window.ManageAttributes = window.ManageAttributes || {};

/*** web/UI code - runs natively in the plugin process ***/

// similar to Properties Plus, specify a max amount of objects the UI responds to
ManageAttributes.nMaxObjectCount = 1000;

// elements that get updated on selection and context change
ManageAttributes.editingHistoryInfoCard = undefined;
ManageAttributes.editingHistoryExistingAttributesCard = undefined;
ManageAttributes.editingHistoryNewAttributesCard = undefined;
ManageAttributes.notInEditingContextMessageCard = undefined;

ManageAttributes.selectionCountInfoCard = undefined;
ManageAttributes.selectionExistingAttributesCard = undefined;
ManageAttributes.selectionNewAttributesCard = undefined;
ManageAttributes.incompatibleSelectionMessageCard = undefined;

// initialize the UI
ManageAttributes.initializeUI = function()
{
    // create a container for all UI elements that should show
    let contentContainer = document.createElement('div');
    contentContainer.id = ManageAttributes.contentContainerID;
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
    ManageAttributes.editingHistoryInfoCard = new FormIt.PluginUI.EditingContextInfoCard();
    contentContainer.appendChild(ManageAttributes.editingHistoryInfoCard.element);

    // message when no group is being edited - attributes can't be added here
    ManageAttributes.notInEditingContextMessageCard = new FormIt.PluginUI.MessageInfoCard('Edit a group to view its history attributes.');
    contentContainer.appendChild(ManageAttributes.notInEditingContextMessageCard.element);
    ManageAttributes.notInEditingContextMessageCard.hide();

    // existing attributes on this history
    ManageAttributes.editingHistoryExistingAttributesCard = new FormIt.PluginUI.InfoCardExpandable('Existing Attributes', false);
    contentContainer.appendChild(ManageAttributes.editingHistoryExistingAttributesCard.element);

    // create new attributes on this history
    ManageAttributes.editingHistoryNewAttributesCard = new FormIt.PluginUI.InfoCardExpandable('Add New Attributes', false);
    contentContainer.appendChild(ManageAttributes.editingHistoryNewAttributesCard.element);

    /*** on selected object ***/

    // selected object section
    let selectedObjectAttributesHeader = new FormIt.PluginUI.SubheaderModule('On Selected Object');
    contentContainer.appendChild(selectedObjectAttributesHeader.element);

    // selection count info card
    ManageAttributes.selectionCountInfoCard = new FormIt.PluginUI.SelectionCountInfoCard(ManageAttributes.nMaxObjectCount);
    contentContainer.appendChild(ManageAttributes.selectionCountInfoCard.element);
    // append the too many objects div now that it has a parent
    ManageAttributes.selectionCountInfoCard.appendTooManyObjectsMessage();

    // message when the selection doesn't contain a single group instance
    ManageAttributes.incompatibleSelectionMessageCard = new FormIt.PluginUI.MessageInfoCard('Select a single group instance to view its attributes.');
    contentContainer.appendChild(ManageAttributes.incompatibleSelectionMessageCard.element);
    ManageAttributes.incompatibleSelectionMessageCard.hide();

    // existing attributes on this object
    ManageAttributes.selectionExistingAttributesCard = new FormIt.PluginUI.InfoCardExpandable('Existing Attributes', false);
    contentContainer.appendChild(ManageAttributes.selectionExistingAttributesCard.element);

    // create new attributes on this history
    ManageAttributes.selectionNewAttributesCard = new FormIt.PluginUI.InfoCardExpandable('Add New Attributes', false);
    contentContainer.appendChild(ManageAttributes.selectionNewAttributesCard.element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the UI
ManageAttributes.updateUI = function()
{
    // get selection info from Properties Plus
    window.FormItInterface.CallMethod("PropertiesPlus.getSelectionInfo", { }, function(result)
    {
        let currentSelectionInfo = JSON.parse(result);

        // update the cards that are always shown
        ManageAttributes.editingHistoryInfoCard.update(currentSelectionInfo);
        ManageAttributes.selectionCountInfoCard.update(currentSelectionInfo);

        // show or hide cards based on the selection

        // message: not in editing context
        currentSelectionInfo.nEditingHistoryID == 0 ? ManageAttributes.notInEditingContextMessageCard.show() : ManageAttributes.notInEditingContextMessageCard.hide();

        // existing attributes on history
        currentSelectionInfo.nEditingHistoryID == 0 ? ManageAttributes.editingHistoryExistingAttributesCard.hide() : ManageAttributes.editingHistoryExistingAttributesCard.show();

        // new attributes on history
        currentSelectionInfo.nEditingHistoryID == 0 ? ManageAttributes.editingHistoryNewAttributesCard.hide() : ManageAttributes.editingHistoryNewAttributesCard.show();

        // message: incompatible selection
        currentSelectionInfo.nSelectedTotalCount == 1 && currentSelectionInfo.nSelectedGroupInstanceCount == 1 ? ManageAttributes.incompatibleSelectionMessageCard.hide() : ManageAttributes.incompatibleSelectionMessageCard.show();

        // existing attributes on object
        currentSelectionInfo.nSelectedTotalCount == 1 && currentSelectionInfo.nSelectedGroupInstanceCount == 1 ? ManageAttributes.selectionExistingAttributesCard.show() : ManageAttributes.selectionExistingAttributesCard.hide();

        // new attributes on object
        currentSelectionInfo.nSelectedTotalCount == 1 && currentSelectionInfo.nSelectedGroupInstanceCount == 1 ? ManageAttributes.selectionNewAttributesCard.show() : ManageAttributes.selectionNewAttributesCard.hide();
    });


}