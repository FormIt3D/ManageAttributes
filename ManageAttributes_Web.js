window.ManageAttributes = window.ManageAttributes || {};

/*** web/UI code - runs natively in the plugin process ***/

// similar to Properties Plus, specify a max amount of objects the UI responds to
ManageAttributes.nMaxObjectCount = 1000;

// elements that get updated on selection and context change
ManageAttributes.editingContextInfoCard = undefined;
ManageAttributes.editingHistoryAttributesCard = undefined;
ManageAttributes.notInEditingContextMessageCard = undefined;

ManageAttributes.selectionCountInfoCard = undefined;
ManageAttributes.selectionAttributesCard = undefined;
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

    // separator and space
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // editing context section
    let currentHistoryAttributesHeader = new FormIt.PluginUI.HeaderModule('In Editing Context', '', 'headerContainer');
    contentContainer.appendChild(currentHistoryAttributesHeader.element);

    // context properties info card
    ManageAttributes.editingContextInfoCard = new FormIt.PluginUI.EditingContextInfoCard();
    contentContainer.appendChild(ManageAttributes.editingContextInfoCard.element);

    // message when no group is being edited - attributes can't be added here
    ManageAttributes.notInEditingContextMessageCard = new FormIt.PluginUI.MessageInfoCard('Edit a group to view its history attributes.');
    contentContainer.appendChild(ManageAttributes.notInEditingContextMessageCard.element);
    ManageAttributes.notInEditingContextMessageCard.hide();

    // separator and space
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // selected object section
    let selectedObjectAttributesHeader = new FormIt.PluginUI.HeaderModule('On Selected Object', '', 'headerContainer');
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
        ManageAttributes.editingContextInfoCard.update(currentSelectionInfo);
        ManageAttributes.selectionCountInfoCard.update(currentSelectionInfo);

        // show or hide cards based on the selection
        currentSelectionInfo.nEditingHistoryID == 0 ? ManageAttributes.notInEditingContextMessageCard.show() : ManageAttributes.notInEditingContextMessageCard.hide();

        currentSelectionInfo.nSelectedTotalCount == 1 && currentSelectionInfo.nSelectedGroupInstanceCount == 1 ? ManageAttributes.incompatibleSelectionMessageCard.hide() : ManageAttributes.incompatibleSelectionMessageCard.show();
    });


}