window.ManageAttributes = window.ManageAttributes || {};

/*** web/UI code - runs natively in the plugin process ***/

// initialize the UI
ManageAttributes.initializeUI = function()
{
    // clear the existing content if it exists
    if (document.getElementById('contentContainer'))
    {
        document.getElementById('contentContainer').parentElement.removeChild(document.getElementById('contentContainer'));
    }

    // create a container for all UI elements that should show
    // when Match Photo mode is inactive
    let contentContainer = document.createElement('div');
    contentContainer.id = ManageAttributes.contentContainerID;
    contentContainer.className = 'contentContainer';
    window.document.body.appendChild(contentContainer);

    // create the overall header for the inactive mode
    let headerContainer = new FormIt.PluginUI.HeaderModule('Manage Attributes', 'View, edit, and delete string attributes in the current context and on the selected object.', 'headerContainer');
    contentContainer.appendChild(headerContainer.element);

    // separator and space
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // editing context section
    let currentHistoryAttributesHeader = new FormIt.PluginUI.HeaderModule('Editing Context', 'Manage string attributes attached to the current editing history.', 'headerContainer');
    contentContainer.appendChild(currentHistoryAttributesHeader.element);

    // separator and space
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // selected object section
    let selectedObjectAttributesHeader = new FormIt.PluginUI.HeaderModule('Selected Object', 'Manage string attributes attached to the selected object.', 'headerContainer');
    contentContainer.appendChild(selectedObjectAttributesHeader.element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the UI
ManageAttributes.updateUI = function()
{
    
}