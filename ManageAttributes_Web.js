window.ManageAttributes = window.ManageAttributes || {};

/*** web/UI code - runs natively in the plugin process ***/

// elements that get updated on selection and context change
ManageAttributes.editingContextInfoCard = undefined;

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
    let currentHistoryAttributesHeader = new FormIt.PluginUI.HeaderModule('In Current History', '', 'headerContainer');
    contentContainer.appendChild(currentHistoryAttributesHeader.element);

    // context properties info card
    ManageAttributes.editingContextInfoCard = new FormIt.PluginUI.EditingContextInfoCard();
    contentContainer.appendChild(ManageAttributes.editingContextInfoCard.element);

    // separator and space
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // selected object section
    let selectedObjectAttributesHeader = new FormIt.PluginUI.HeaderModule('On Selected Object', '', 'headerContainer');
    contentContainer.appendChild(selectedObjectAttributesHeader.element);

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

        ManageAttributes.editingContextInfoCard.update(currentSelectionInfo);
    });


}