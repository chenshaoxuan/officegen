var EMU = 914400; // OfficeXML measures in English Metric Units


module.exports = {

  // assume passed in an array of row objects
  getTable: function(rows, options) {
    var options = options || {};
	options.tabstyle=options.tabstyle?options.tabstyle:"{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"
    if (options.columnWidth === undefined) {
      options.columnWidth = 8 / (rows[0].length) * EMU
    }
    var self = this;

    return self._getBase(
        rows.map(function(row,row_idx) {
          return self._getRow(
              row.map(function(val,idx) {
                return self._getCell(val, options,idx,row_idx);
              }),
              options
          );
        }),
        self._getColSpecs(rows, options),
        options
    )
  },

  "_getBase": function (rowSpecs, colSpecs, options) {
    var self = this;

    return {
      "p:graphicFrame": {
        "p:nvGraphicFramePr": {
          "p:cNvPr": {
            "@id": "6",
            "@name": "Table 5"
          },
          "p:cNvGraphicFramePr": {
            "a:graphicFrameLocks": {
              "@noGrp": "1"
            }
          },
          "p:nvPr": {
            "p:extLst": {
              "p:ext": {
                "@uri": "{D42A27DB-BD31-4B8C-83A1-F6EECF244321}",
                "p14:modId": {
                  "@xmlns:p14": "http://schemas.microsoft.com/office/powerpoint/2010/main",
                  "@val": "1579011935"
                }
              }
            }
          }
        },
        "p:xfrm": {
          "a:off": {
            "@x": options.x || "1524000",
            "@y": options.y || "1397000"
          },
          "a:ext": {
            "@cx": options.cx || "6096000",
            "@cy": options.cy || "1483360"
          }
        },
        "a:graphic": {
          "a:graphicData": {
            "@uri": "http://schemas.openxmlformats.org/drawingml/2006/table",
            "a:tbl": {
              "a:tblPr": {
                "@firstRow": "1",
                "@bandRow": "1",
                "a:tableStyleId":options.tabstyle//"{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"
              },
              "a:tblGrid": {
                "#list": colSpecs
              },

              "#list": [rowSpecs]  // replace this with  an array of table row objects
            }
          }
        }
      }
    }
  },

  _getColSpecs: function(rows, options) {
    var self = this;
    return rows[0].map(function(val,idx) {
      return self._tblGrid(idx, options);
    })
  },

  _tblGrid: function(idx, options) {
    return {
      "a:gridCol": {
        "@w": (options.columnWidths ? options.columnWidths[idx] : options.columnWidth||"0" ) //|| "2048000"
      }
    };
  },

  _getRow: function (cells, options) {
    return {
      "a:tr": {
        "@h": options.rowHeight ||"0", //|| "370840",
        "#list": [cells] // populate this with an array of table cell objects
      }
    }
  },

  _getCell: function (val, options,idx,row_idx) {
    var font_size = options.font_size || 14;
    var font_face = options.font_face || "Times New Roman";
    return {
      "a:tc": {
        "a:txBody": {
          "a:bodyPr": {},
          "a:lstStyle": {},

          "a:p": {"a:pPr":{"@algn":options.align?(options.align[idx]?options.align[idx]:'ctr'):'ctr'},
            "a:r": {
              "a:rPr": {
                "@lang": "en-US",
                "@sz": ""+font_size*100,
                "@dirty": "0",
                "@smtClean": "0",
				"@b":options.bold?(options.bold[row_idx]?(options.bold[row_idx][idx]?options.bold[row_idx][idx]:"0"):"0"):"0",
                "@i":options.italics?(options.italics[row_idx]?(options.italics[row_idx][idx]?options.italics[row_idx][idx]:"0"):"0"):"0",
                "a:latin": {
                  "@typeface": font_face
                },
                "a:cs": {
                  "@typeface": font_face
                }
              },
              "a:t": val  // this is the cell value
            },
            "a:endParaRPr": {
              "@lang": "en-US",
              "@sz": ""+font_size*100,
              "@dirty": "0",
              "a:latin": {
                "@typeface": font_face
              },
              "a:cs": {
                "@typeface": font_face
              }
            }
          }
        },
        "a:tcPr": {}
      }
    }
  }
}
