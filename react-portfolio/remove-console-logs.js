#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Automated Console Log Removal Script
 * Removes all console.log statements from TypeScript and JavaScript files
 */

class ConsoleLogRemover {
  constructor() {
    this.processedFiles = 0;
    this.removedLogs = 0;
    this.skippedFiles = [];
    this.modifiedFiles = [];
  }

  // File extensions to process
  shouldProcessFile(filePath) {
    const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    const ext = path.extname(filePath);
    
    // Skip node_modules and build directories
    if (filePath.includes('node_modules') || 
        filePath.includes('build') || 
        filePath.includes('dist') ||
        filePath.includes('.git')) {
      return false;
    }
    
    return validExtensions.includes(ext);
  }

  // Remove console logs from file content
  removeConsoleLogs(content, filePath) {
    const originalContent = content;
    let logsRemoved = 0;
    
    // Split into lines for precise line-by-line processing
    const lines = content.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this line contains a console statement (more aggressive approach)
      const consolePatterns = [
        /^\s*console\.log\s*\(/,
        /^\s*console\.(warn|error|info|debug)\s*\(/,
        /^\s*console\.error\s*\(/
      ];
      
      let isConsoleLine = false;
      for (const pattern of consolePatterns) {
        if (pattern.test(line)) {
          isConsoleLine = true;
          logsRemoved++;
          break;
        }
      }
      
      if (!isConsoleLine) {
        // Check for inline console logs (more complex cases)
        let processedLine = line;
        
        // Handle console.log as part of a larger expression (be very careful)
        const inlinePatterns = [
          // console.log('simple string');
          /console\.log\s*\(\s*['"`][^'"`]*['"`]\s*\)\s*;?\s*/g,
          // console.log(simpleVariable);
          /console\.log\s*\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\)\s*;?\s*/g
        ];
        
        for (const pattern of inlinePatterns) {
          const matches = processedLine.match(pattern);
          if (matches) {
            // Only remove if it's clearly a standalone console.log, not part of a method chain
            const beforeMatch = processedLine.split(matches[0])[0];
            const afterMatch = processedLine.split(matches[0])[1];
            
            // Check if it's safe to remove (not part of a method chain or complex expression)
            if (!beforeMatch.includes('(') || beforeMatch.trim().endsWith(';') || beforeMatch.trim() === '') {
              processedLine = processedLine.replace(pattern, '');
              logsRemoved += matches.length;
            }
          }
        }
        
        processedLines.push(processedLine);
      }
      // If isConsoleLine is true, we skip adding this line (effectively removing it)
    }
    
    const newContent = processedLines.join('\n');
    
    // Clean up multiple consecutive empty lines
    const cleanedContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Track changes
    if (cleanedContent !== originalContent) {
      this.modifiedFiles.push({
        file: filePath,
        logsRemoved: logsRemoved
      });
      this.removedLogs += logsRemoved;
    }

    return { content: cleanedContent, logsRemoved };
  }

  // Process a single file
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: newContent, logsRemoved } = this.removeConsoleLogs(content, filePath);
      
      if (logsRemoved > 0) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ ${path.relative(process.cwd(), filePath)}: removed ${logsRemoved} console.log(s)`);
      }
      
      this.processedFiles++;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      this.skippedFiles.push(filePath);
    }
  }

  // Recursively process directory
  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        await this.processDirectory(itemPath);
      } else if (stat.isFile() && this.shouldProcessFile(itemPath)) {
        await this.processFile(itemPath);
      }
    }
  }

  // Main execution
  async run(targetPath = './src') {
    console.log('🧹 Starting Console Log Removal...\n');
    
    const startTime = Date.now();
    
    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Target path "${targetPath}" does not exist`);
      process.exit(1);
    }
    
    await this.processDirectory(targetPath);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n📊 SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`📁 Files processed: ${this.processedFiles}`);
    console.log(`🗑️  Console logs removed: ${this.removedLogs}`);
    console.log(`📝 Files modified: ${this.modifiedFiles.length}`);
    console.log(`⚠️  Files skipped: ${this.skippedFiles.length}`);
    console.log(`⏱️  Duration: ${duration}s`);
    
    if (this.modifiedFiles.length > 0) {
      console.log('\n📝 MODIFIED FILES:');
      this.modifiedFiles.forEach(({ file, logsRemoved }) => {
        console.log(`  • ${path.relative(process.cwd(), file)} (${logsRemoved} logs)`);
      });
    }
    
    if (this.skippedFiles.length > 0) {
      console.log('\n⚠️  SKIPPED FILES:');
      this.skippedFiles.forEach(file => {
        console.log(`  • ${path.relative(process.cwd(), file)}`);
      });
    }
    
    console.log('\n✨ Console log removal completed!');
    
    if (this.removedLogs > 0) {
      console.log('\n💡 TIP: Remember to test your application to ensure nothing was broken.');
    }
  }
}

// CLI execution
if (require.main === module) {
  const targetPath = process.argv[2] || './src';
  const remover = new ConsoleLogRemover();
  
  remover.run(targetPath).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = ConsoleLogRemover;