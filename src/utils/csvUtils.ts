
// Utility functions for working with CSV data

/**
 * Parse CSV string into an array of objects
 * @param csvString The CSV string to parse
 * @param headers Optional column headers (if not provided, first row is used as headers)
 * @returns Array of objects with keys from headers
 */
export const parseCSV = (csvString: string, headers?: string[]): any[] => {
  if (!csvString || typeof csvString !== 'string') {
    console.error('Invalid CSV string:', csvString);
    return [];
  }

  // Split the CSV string into rows
  const rows = csvString.trim().split('\n');
  
  if (rows.length === 0) {
    return [];
  }

  // Use provided headers or first row as headers
  const columnHeaders = headers || rows[0].split(',').map(header => header.trim());
  
  // Start from index 1 if first row is headers
  const startRow = headers ? 0 : 1;
  
  // Parse each row into an object
  return rows.slice(startRow).map(row => {
    const values = row.split(',').map(value => value.trim());
    const rowObject: Record<string, string> = {};
    
    columnHeaders.forEach((header, index) => {
      rowObject[header] = values[index] || '';
    });
    
    return rowObject;
  });
};

/**
 * Convert array of objects to CSV string
 * @param data Array of objects to convert
 * @returns CSV string
 */
export const objectsToCSV = (data: any[]): string => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  data.forEach(item => {
    const values = headers.map(header => {
      const value = item[header] || '';
      // Escape values with commas
      return value.toString().includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

/**
 * Load a CSV file
 * @param filePath Path to the CSV file
 * @returns Promise resolving to parsed CSV data
 */
export const loadCSV = async (filePath: string): Promise<any[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};

/**
 * Save data as CSV file (browser download)
 * @param data Array of objects to save
 * @param filename Filename for the download
 */
export const saveCSV = (data: any[], filename: string): void => {
  const csvString = objectsToCSV(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
