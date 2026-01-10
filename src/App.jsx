import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Search, 
  Database, 
  Download, 
  CheckCircle2, 
  Activity,
  Type,
  Users,
  Layers
} from 'lucide-react';

/**
 * OmVetan Payroll - Zero-Dependency CSS Version
 * No Tailwind, No PostCSS required. 
 * Preserves all layout features and PDF wrapping.
 */

const styles = {
  container: {
    minHeight: '100vh',
    paddingBottom: '3rem',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    textAlign: 'left',
  },
  nav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    padding: '0.75rem 1.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  navContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontWeight: '600',
    color: '#334155',
  },
  uploadArea: {
    flexGrow: 1,
    border: '2px dashed #e2e8f0',
    borderRadius: '0.75rem',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '1rem',
  },
  inputGroup: {
    marginBottom: '1.25rem',
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem',
    marginLeft: '0.25rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  iconInside: {
    position: 'absolute',
    left: '0.75rem',
    color: '#94a3b8',
  },
  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.65rem 1rem 0.65rem 2.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  actionBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '0.85rem 3rem',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
  },
  previewCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  previewHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.875rem',
  },
  terminal: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: '0.7rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  }
};

export default function App() {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("No file selected");
  const [employeeNames, setEmployeeNames] = useState("");
  const [requiredFields, setRequiredFields] = useState("");
  const [slipHeader, setSlipHeader] = useState("SALARY SLIP");
  const [previewList, setPreviewList] = useState([]); 
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [logs, setLogs] = useState([
    { msg: "System ready.", type: "success", time: new Date().toLocaleTimeString() }
  ]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    const loadScript = (url) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initLibs = async () => {
      try {
        addLog("Connecting data modules...", "info");
        await loadScript('https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');
        setLibsLoaded(true);
        addLog("Modules synchronized successfully.", "success");
      } catch (err) { addLog("Failed to load modules.", "error"); }
    };
    initLibs();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { msg: message, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !libsLoaded) return;
    setFileName(file.name);
    addLog(`Reading file: ${file.name}`, "info");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const XLSX = window.XLSX;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setExcelData(json);
        addLog(`Imported ${json.length} records.`, "success");
      } catch (err) { addLog("Error parsing file.", "error"); }
    };
    reader.readAsArrayBuffer(file);
  };

  const processScan = () => {
    if (excelData.length === 0 || !employeeNames) {
      addLog("Data source or targets missing.", "error");
      return;
    }
    const targets = employeeNames.split(',').map(n => n.trim().toLowerCase()).filter(n => n);
    const isWildcard = targets.includes('*');

    let matchedRows = isWildcard ? excelData : excelData.filter(row => 
      Object.values(row).some(val => targets.includes(String(val).trim().toLowerCase()))
    );

    if (matchedRows.length === 0) {
      addLog(`No records found for specified targets.`, "error");
      setPreviewList([]);
      return;
    }

    const rowKeys = Object.keys(matchedRows[0]);
    const requested = requiredFields.split(',').map(f => f.trim()).filter(f => f);
    
    const fieldMapping = requested.map(req => {
      const searchStr = req.toLowerCase();
      let matchedKey = rowKeys.find(k => k.trim().toLowerCase() === searchStr);
      let displayLabel = req;

      if (!matchedKey) {
        for (const row of excelData) {
          const entry = Object.entries(row).find(([key, val]) => String(val).trim().toLowerCase() === searchStr);
          if (entry) {
            matchedKey = entry[0];
            displayLabel = String(entry[1]).trim();
            break; 
          }
        }
      }
      return { matchedKey, displayLabel };
    }).filter(m => m.matchedKey);

    setPreviewList(matchedRows.map(row => {
      const nameInRow = Object.values(row).find(v => isWildcard || targets.includes(String(v).trim().toLowerCase())) || "Unknown";
      const stats = requested.length > 0 ? fieldMapping.map(m => ({ label: m.displayLabel, val: row[m.matchedKey] })) : 
                    rowKeys.filter(k => !k.startsWith('_EMPTY_')).map(k => ({ label: k, val: row[k] }));
      return { name: nameInRow, stats };
    }));
    addLog(`Successfully prepared ${matchedRows.length} slips.`, "success");
  };

  const createEmployeeDoc = (doc, employee, index, total) => {
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);

    if (index > 0) doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    const headerText = slipHeader.toUpperCase();
    const wrappedHeader = doc.splitTextToSize(headerText, maxWidth);
    doc.text(wrappedHeader, margin, 25);
    
    let currentY = 25 + (wrappedHeader.length * 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, currentY);
    doc.text(`Employee Slip: ${index + 1} / ${total}`, pageWidth - margin - 35, currentY);

    currentY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("Employee Name:", margin, currentY);
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(String(employee.name).toUpperCase(), margin, currentY);

    let tableBody = [];
    let tableHead = [['Description', 'Value']];
    if (employee.stats.length > 12) {
      tableHead = [['Description', 'Value', 'Description', 'Value']];
      const half = Math.ceil(employee.stats.length / 2);
      for (let i = 0; i < half; i++) {
        const left = employee.stats[i];
        const right = employee.stats[i + half];
        tableBody.push([
          left.label, left.val,
          right ? right.label : "", right ? right.val : ""
        ]);
      }
    } else { tableBody = employee.stats.map(s => [s.label, s.val]); }

    doc.autoTable({
      startY: currentY + 8,
      head: tableHead,
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8.5, cellPadding: 4 },
      margin: { left: margin, right: margin },
      avoidPageBreak: true 
    });
  };

  const generateBulkPDF = () => {
    if (previewList.length === 0 || !window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    previewList.forEach((employee, index) => createEmployeeDoc(doc, employee, index, previewList.length));
    doc.save(`OmVetan_Batch_${new Date().toISOString().slice(0,10)}.pdf`);
    addLog("Batch exported successfully.", "success");
  };

  return (
    <div style={styles.container}>
      <style>{`
        #root { width: 100%; margin: 0; padding: 0; display: block; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        table tr:hover { background-color: #f8fafc; }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                OmVetan <span style={{ color: '#4f46e5' }}>Payroll</span>
              </h1>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic', fontWeight: '500' }}>Salary slip made simple</p>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: libsLoaded ? '#10b981' : '#f59e0b', backgroundColor: libsLoaded ? '#f0fdf4' : '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
            ● {libsLoaded ? 'System Online' : 'Syncing...'}
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.dashboardGrid}>
          <section style={styles.card}>
            <div style={styles.headerRow}>
              <Database size={16} color="#4f46e5" /> 1. Data Source
            </div>
            <label style={styles.uploadArea}>
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".xlsx, .xls" />
              <FileSpreadsheet size={44} color={libsLoaded ? '#4f46e5' : '#cbd5e1'} style={{ marginBottom: '0.75rem' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{fileName}</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>XLSX or XLS supported</span>
            </label>
          </section>

          <section style={styles.card}>
            <div style={styles.headerRow}>
              <Search size={16} color="#4f46e5" /> 2. Parameters
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Salary Header</label>
              <div style={styles.inputWrapper}>
                <Type size={16} style={styles.iconInside} />
                <input style={styles.input} type="text" placeholder="COMPANY NAME" value={slipHeader} onChange={e => setSlipHeader(e.target.value)} />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Employee Name(s)</label>
              <div style={styles.inputWrapper}>
                <Users size={16} style={styles.iconInside} />
                <input style={styles.input} type="text" placeholder="John Doe or *" value={employeeNames} onChange={e => setEmployeeNames(e.target.value)} />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Specific Fields</label>
              <div style={styles.inputWrapper}>
                <CheckCircle2 size={16} style={styles.iconInside} />
                <input style={styles.input} type="text" placeholder="Basic, Net Salary" value={requiredFields} onChange={e => setRequiredFields(e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={processScan} disabled={!libsLoaded} style={styles.actionBtn}>
            <Layers size={18} /> Prepare records
          </motion.button>
        </div>

        <AnimatePresence>
          {previewList.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.previewCard}>
              <div style={styles.previewHeader}>
                <div>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0 }}>Batch Ready</h2>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{previewList.length} slips generated</p>
                </div>
                <button onClick={generateBulkPDF} style={{ ...styles.actionBtn, padding: '0.5rem 1.5rem', fontSize: '0.75rem', boxShadow: 'none' }}>
                  <Download size={14} /> Download PDF
                </button>
              </div>
              <div style={{ maxHeight: '250px', overflowY: 'auto' }} className="custom-scrollbar">
                <table style={styles.table}>
                  <thead style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0 }}>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600', fontSize: '0.65rem', textTransform: 'uppercase' }}>Name</th>
                      <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600', fontSize: '0.65rem', textTransform: 'uppercase' }}>Fields</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewList.map((emp, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1.5rem', fontWeight: '700', color: '#334155' }}>{emp.name}</td>
                        <td style={{ padding: '0.75rem 1.5rem', color: '#64748b' }}>{emp.stats.length} nodes mapped</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section style={styles.terminal}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem', color: '#f8fafc' }}>
            <Activity size={14} color="#6366f1" /> SYSTEM TERMINAL
          </div>
          <div style={{ height: '100px', overflowY: 'auto' }} className="custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '0.35rem', display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#475569' }}>[{log.time}]</span>
                <span style={{ color: log.type === 'error' ? '#f87171' : log.type === 'success' ? '#34d399' : '#94a3b8' }}>
                   {" > "} {log.msg}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>
        OmVetan Payroll System // salary slip made simple
      </footer>
    </div>
  );
}