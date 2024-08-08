// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Success Image element
const successElement = document.createElement('img');
successElement.className = 'status-img';
successElement.src = '/assets/images/success.svg';

// Error Image element
const errorElement = document.createElement('img');
errorElement.className = 'status-img';
errorElement.src = '/assets/images/error.svg';

// Endpoint to get report config
const reportUrl = 'https://aka.ms/CaptureViewsReportEmbedConfig';

//const reportUrl = 'http://10.10.0.56/PowerBIReports/powerbi/GovHost?rs:embed=true';




const errorClass = 'error';
const successClass = 'success';

// To show / hide the report container
const hidden = 'hidden';

// To position the display message
const position = 'position';

export { errorClass, errorElement, hidden, position, reportUrl, successClass, successElement };
