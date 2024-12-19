import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import { SparklinesModule } from "ag-grid-enterprise";
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsEnterpriseModule)
]);

ModuleRegistry.registerModules([SparklinesModule.with(AgChartsEnterpriseModule)]);

// Import AG Grid styles
import "ag-grid-community/styles/ag-theme-alpine.css";

const PlacementsDrillDown = ({ tile }) => {
  const gridRef = useRef();

  // Grid container styles
  const containerStyle = useMemo(() => ({ width: "100%", height: "100vh" }), []);
  const gridStyle = useMemo(() => ({ height: "95vh", width: "100%" }), []);

  // Row data
  const [rowData] = useState(
    [{
      symbol: 'A',
      name: 'Agilent Technologies Inc. Common Stock',
      lastPrice: '179.28',
      marketCap: 54272119919,
      volume: 971760,
      sector: 'Capital Goods',
      rateOfChange: [1, 2, -6, -7, -2, -7, 3, 4, -3, -8],
    },
      {
        symbol: 'AAL',
        name: 'American Airlines Group Inc. Common Stock',
        lastPrice: '19.37',
        marketCap: 12541258186,
        volume: 20309670,
        sector: 'Transportation',
        rateOfChange: [4, 9, 8, 6, 1, -3, 0, -8, 2, -8],
      },
      {
        symbol: 'AAP',
        name: 'Advance Auto Parts Inc Advance Auto Parts Inc W/I',
        lastPrice: '199.44',
        marketCap: 12564867785,
        volume: 699427,
        sector: 'Consumer Services',
        rateOfChange: [-10, 0, 7, -6, 7, 4, 1, 9, 7, 7],
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc. Common Stock',
        lastPrice: '154.30',
        marketCap: 2675150000000,
        volume: 57807909,
        sector: 'Technology',
        rateOfChange: [-6, 0, -1, -2, -6, -1, -5, -2, -8, 4],
      },
      {
        symbol: 'ABB',
        name: 'ABB Ltd Common Stock',
        lastPrice: '37.67',
        marketCap: 75566020000,
        volume: 901811,
        sector: 'Consumer Durables',
        rateOfChange: [8, -2, -6, 5, 2, 0, -7, -5, 2, -2],
      },
      {
        symbol: 'ABBV',
        name: 'AbbVie Inc. Common Stock',
        lastPrice: '111.62',
        marketCap: 197252000000,
        volume: 5364090,
        sector: 'Health Care',
        rateOfChange: [5, 9, 10, 8, 0, 9, 3, 1, 3, 2],
      },
      {
        symbol: 'ABC',
        name: 'AmerisourceBergen Corporation Common Stock',
        lastPrice: '125.14',
        marketCap: 26002479696,
        volume: 549618,
        sector: 'Health Care',
        rateOfChange: [9, 6, 4, 8, 10, 5, 1, 9, 8, 3],
      },
      {
        symbol: 'ABEV',
        name: 'Ambev S.A. American Depositary Shares (Each representing 1 Common Share)',
        lastPrice: '3.14',
        marketCap: 49414685958,
        volume: 27226664,
        sector: 'Consumer Non-Durables',
        rateOfChange: [6, 0, 4, 8, -5, 0, -2, -2, -4, -6],
      },
      {
        symbol: 'ABMD',
        name: 'ABIOMED Inc. Common Stock',
        lastPrice: '372.69',
        marketCap: 16912759037,
        volume: 137763,
        sector: 'Health Care',
        rateOfChange: [-1, -8, -6, -5, -2, -2, 0, -8, 0, 8],
      },
      {
        symbol: 'ABNB',
        name: 'Airbnb Inc. Class A Common Stock',
        lastPrice: '158.00',
        marketCap: 94231043106,
        volume: 4456806,
        sector: 'Capital Goods',
        rateOfChange: [-4, -8, -4, -9, -5, -5, -1, -1, -3, -1],
      }]
  );

  const [columnDefs, setColumnDefs] = useState([
    { field: "symbol", maxWidth: 110 },
    { field: "name", minWidth: 250 },
    {
      field: "rateOfChange",
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "area",
        },
      },
    },
    { field: "volume", maxWidth: 140 },
  ]);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true
  }), []);

  return (
    <div style={containerStyle}>
      <h3>Placements DrillDown: {tile.title}</h3>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={50}
        />
      </div>
    </div>
  );
};

export default PlacementsDrillDown;
