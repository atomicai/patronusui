import { PlotParams } from 'react-plotly.js'

import { Doc } from '../../@types/search'

export const example: PlotParams = {
  data: [
    {
      hoverinfo: 'text',
      hovertext: [
        '<b>Topic 0</b><br>Words: client, operator, pdf, okko, ',
        '<b>Topic 0</b><br>Words: operator, client, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: operator, client, okko, pdf, ',
        '<b>Topic 0</b><br>Words: operator, client, okko, pdf, ',
        '<b>Topic 0</b><br>Words: operator, client, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: operator, client, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, ',
        '<b>Topic 0</b><br>Words: client, operator, okko, pdf, '
      ],
      marker: {
        color: '#E69F00'
      },
      mode: 'lines',
      name: '0_client_operator_pdf_okko',
      x: [
        '2022-07-01T02:28:06.091000',
        '2022-07-01T18:54:01.449999',
        '2022-07-02T11:00:36.900000',
        '2022-07-03T03:07:12.350000',
        '2022-07-03T19:13:47.800000',
        '2022-07-04T11:20:23.249999',
        '2022-07-05T03:26:58.700000',
        '2022-07-05T19:33:34.150000',
        '2022-07-07T19:53:20.500000',
        '2022-07-08T11:59:55.950000',
        '2022-07-09T04:06:31.400000',
        '2022-07-10T12:19:42.300000',
        '2022-07-13T20:52:39.550000'
      ],
      y: [22, 3, 3, 5, 5, 1, 4, 1, 1, 1, 1, 1, 1],
      type: 'scatter'
    },
    {
      hoverinfo: 'text',
      hovertext: [
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: client, operator, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , ',
        '<b>Topic 1</b><br>Words: operator, client, , , '
      ],
      marker: {
        color: '#56B4E9'
      },
      mode: 'lines',
      name: '1_operator_client__',
      x: [
        '2022-07-01T02:28:06.091000',
        '2022-07-01T18:54:01.449999',
        '2022-07-03T03:07:12.350000',
        '2022-07-03T19:13:47.800000',
        '2022-07-04T11:20:23.249999',
        '2022-07-05T19:33:34.150000',
        '2022-07-07T03:46:45.049999',
        '2022-07-08T11:59:55.950000'
      ],
      y: [6, 2, 1, 2, 1, 1, 1, 1],
      type: 'scatter'
    }
  ],
  layout: {
    template: {
      data: {
        barpolar: [
          {
            marker: {
              line: {
                color: 'white',
                width: 0.5
              },
              pattern: {
                fillmode: 'overlay',
                size: 10,
                solidity: 0.2
              }
            },
            type: 'barpolar'
          }
        ],
        bar: [
          {
            marker: {
              line: {
                color: 'white',
                width: 0.5
              },
              pattern: {
                fillmode: 'overlay',
                size: 10,
                solidity: 0.2
              }
            },
            type: 'bar'
          }
        ],
        carpet: [
          {
            type: 'carpet'
          }
        ],
        choropleth: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            type: 'choropleth'
          }
        ],
        contourcarpet: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            type: 'contourcarpet'
          }
        ],
        contour: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'contour'
          }
        ],
        heatmapgl: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'heatmapgl'
          }
        ],
        heatmap: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'heatmap'
          }
        ],
        histogram2dcontour: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'histogram2dcontour'
          }
        ],
        histogram2d: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'histogram2d'
          }
        ],
        histogram: [
          {
            marker: {
              line: {
                color: 'white',
                width: 0.6
              }
            },
            type: 'histogram'
          }
        ],
        mesh3d: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            type: 'mesh3d'
          }
        ],
        parcoords: [
          {
            type: 'parcoords'
          }
        ],
        pie: [
          {
            automargin: true,
            type: 'pie'
          }
        ],
        scatter3d: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scatter3d'
          }
        ],
        scattercarpet: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scattercarpet'
          }
        ],
        scattergeo: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scattergeo'
          }
        ],
        scattergl: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scattergl'
          }
        ],
        scattermapbox: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scattermapbox'
          }
        ],
        scatterpolargl: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scatterpolargl'
          }
        ],
        scatterpolar: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scatterpolar'
          }
        ],
        scatter: [
          {
            fillpattern: {
              fillmode: 'overlay',
              size: 10,
              solidity: 0.2
            },
            type: 'scatter'
          }
        ],
        scatterternary: [
          {
            marker: {
              colorbar: {
                outlinewidth: 1,
                tickcolor: 'rgb(36,36,36)',
                ticks: 'outside'
              }
            },
            type: 'scatterternary'
          }
        ],
        surface: [
          {
            colorbar: {
              outlinewidth: 1,
              tickcolor: 'rgb(36,36,36)',
              ticks: 'outside'
            },
            colorscale: [
              [0.0, '#440154'],
              [0.1111111111111111, '#482878'],
              [0.2222222222222222, '#3e4989'],
              [0.3333333333333333, '#31688e'],
              [0.4444444444444444, '#26828e'],
              [0.5555555555555556, '#1f9e89'],
              [0.6666666666666666, '#35b779'],
              [0.7777777777777778, '#6ece58'],
              [0.8888888888888888, '#b5de2b'],
              [1.0, '#fde725']
            ],
            type: 'surface'
          }
        ],
        table: [
          {
            type: 'table'
          }
        ]
      }
    },
    xaxis: {
      showgrid: true
    },
    yaxis: {
      showgrid: true,
      title: {
        text: 'Frequency'
      }
    },
    title: {
      font: {
        size: 22,
        color: 'Black'
      },
      text: '<b>Topics over Time',
      y: 0.95,
      x: 0.4,
      xanchor: 'center',
      yanchor: 'top'
    },
    hoverlabel: {
      font: {
        size: 16,
        family: 'Rockwell'
      },
      bgcolor: 'white'
    },
    width: 1250,
    height: 450,
    legend: {
      title: {
        text: '<b>Global Topic Representation'
      }
    }
  }
}

// "proxy": "http://localhost:5000",

export const known: Doc = {
  title: 'YORFHF',
  score: '0,87',

  text: 'fdksjfbdkfbkdjsfnjsdkfnkdjdfsjdfjdjfldsfj sldjfldk jsldkfj dl',
  timestamp: '22/08/22 22:40:41'
}

export const unknown: Doc = {
  title: 'YORFHF',
  score: '0,87',

  text: 'fdksjfbdkfbkdjsfnjsdkfnkdj slkdfjd lskjfl kdjfl sdkfj ',
  timestamp: '22/08/22 22:40:41'
}
