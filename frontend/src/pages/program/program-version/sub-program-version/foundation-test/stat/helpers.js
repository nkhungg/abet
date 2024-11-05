const tabInfo = {
  'subject.pass': 'Pass',
  'subject.passPercent': 'Pass Percent (%)',
  'subject.fail': 'Fail',
  'subject.failPercent': 'Fail Percent (%)',
  'subject.total': 'Total',
  'subject.totalPercent': 'Total Percent (%)',
  'subject': 'Subject',
  'grade.count': 'Number of students',
  'grade': 'Grade',
  'year.count': 'Number of students',
  'year': 'Year',
  'answer.pass': 'Pass',
  'answer.passPercent': 'Pass Percent (%)',
  'answer.total': 'Total',
  'answer.totalPercent': 'Total Percent (%)',
  'answer': 'Question',
  'outcome.pass': 'Pass',
  'outcome.passPercent': 'Pass Percent (%)',
  'outcome.fail': 'Fail',
  'outcome.failPercent': 'Fail Percent (%)',
  'outcome.total': 'Total',
  'outcome.totalPercent': 'Total Percent (%)',
  'outcome': 'Outcome',
  'indicator.pass': 'Pass',
  'indicator.passPercent': 'Pass Percent (%)',
  'indicator.fail': 'Fail',
  'indicator.failPercent': 'Fail Percent (%)',
  'indicator.total': 'Total',
  'indicator.totalPercent': 'Total Percent (%)',
  'indicator': 'Indicator',
}

const randomInteger = (max) => {
  return Math.floor(Math.random()*(max + 1));
}

const randomRgbaColor = () => {
  const r = randomInteger(255);
  const g = randomInteger(255);
  const b = randomInteger(255);
  return `rgba(${r},${g},${b}, 0.4)`;
}

let backgroundColor = [];

const pieBgColor = (numberOfSection) => {
  for(var i = 0; i < numberOfSection; i++) {
    backgroundColor.push(randomRgbaColor());
  }
  return backgroundColor;
}

let barBgColor = [
  'rgba(53, 162, 235, 0.5)',
  'rgba(255, 99, 132, 0.5)'
]

export const convertTableData = (val, tab, labels = []) => {
  if (!val?.length) return;
  const header = [tabInfo[`${tab}`]].concat(val.map(item => item.name));
  const rows = [];
  labels.forEach(label => {
    rows.push(val.reduce((obj, item) => {
      obj.push({ name: item.name, value: item[camelize(label)] });
      return obj;
    }, [{ name: null, value: tabInfo[`${tab}.${label}`] }]));
  })
  return { header, rows };
};

export const convertChartData = (val = [], labels = [], isPieChart = false) => {
  const header = val.map(item => item.name);
  const datasets = [];
  labels.forEach((label, idx) => {
    const infoLabel = {
      label: label,
      data: val.map(itm => itm[camelize(label)]),
      backgroundColor: isPieChart ? pieBgColor(val?.length) : barBgColor[idx],
    }
    datasets.push(infoLabel);
  })
  return {
    labels: header,
    datasets,
  };
};

export const camelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

export const standardizeData = (datas) => {
  if (!datas?.length) return;
  return datas.map(item => {
    return {
      ...item, 
      passPercent: +(((item.pass || item.count)/item.total)*100).toFixed(2),
      failPercent: +((item.fail/item.total)*100).toFixed(2),
      totalPercent: 100
    }
  })
};

export const exportChart = (chartRef) => {
  const link = document.createElement('a');
  link.download = "chart.jpeg";
  link.href = chartRef?.current?.toBase64Image('jpeg', 1);
  link.click();
};

export const convertYear = (string) => {
  if (string.startsWith('5')) {
    return `20${string.substring(1)}`
  } else {
    return `20${string.substring(0, 2)}`
  }
};

export const exportTableToExcel = (tableID, filename = '') => {
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = filename?filename+'.xls':'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
};