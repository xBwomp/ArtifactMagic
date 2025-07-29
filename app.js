// Artifact Magic Tech - Main Application
// Secure and optimized version with proper error handling and performance improvements

class ArtifactMagicApp {
  constructor() {
    this.choices = ARTIFACT_DATA.choices;
    this.artifacts = ARTIFACT_DATA.artifacts;
    this.relevantArtifacts = [];
    this.matrixAnimation = null;
    this.isVisible = true;
    
    this.init();
  }

  init() {
    try {
      this.initializeChoices();
      this.initializeMatrixAnimation();
      this.setupEventListeners();
      this.setupVisibilityHandling();
    } catch (error) {
      this.showError('Failed to initialize application: ' + error.message);
    }
  }

  initializeChoices() {
    const choiceGrid = document.getElementById('choiceGrid');
    if (!choiceGrid) {
      throw new Error('Choice grid element not found');
    }

    const fragment = document.createDocumentFragment();
    
    this.choices.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice;
      button.classList.add('choice-item');
      button.setAttribute('data-choice', choice);
      fragment.appendChild(button);
    });

    choiceGrid.appendChild(fragment);
  }

  setupEventListeners() {
    // Event delegation for choice buttons
    const choiceGrid = document.getElementById('choiceGrid');
    if (choiceGrid) {
      choiceGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('choice-item')) {
          this.toggleChoice(e.target);
        }
      });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToExcel());
    }

    // Window resize handling
    window.addEventListener('resize', this.debounce(() => {
      this.resizeMatrixCanvas();
    }, 250));

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  setupVisibilityHandling() {
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.resumeMatrixAnimation();
      } else {
        this.pauseMatrixAnimation();
      }
    });
  }

  toggleChoice(button) {
    try {
      button.classList.toggle('selected');
      this.updateArtifacts();
    } catch (error) {
      this.showError('Failed to toggle choice: ' + error.message);
    }
  }

  updateArtifacts() {
    try {
      const selectedChoices = Array.from(document.querySelectorAll('.choice-item.selected'))
        .map(btn => btn.getAttribute('data-choice'))
        .filter(Boolean);

      const artifactList = document.getElementById('artifactList');
      const exportBtn = document.getElementById('exportBtn');
      
      if (!artifactList || !exportBtn) {
        throw new Error('Required DOM elements not found');
      }

      artifactList.innerHTML = '<p class="loading">Analyzing artifact combinations...</p>';
      exportBtn.disabled = true;

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        this.processArtifacts(selectedChoices, artifactList, exportBtn);
      });

    } catch (error) {
      this.showError('Failed to update artifacts: ' + error.message);
    }
  }

  processArtifacts(selectedChoices, artifactList, exportBtn) {
    try {
      this.relevantArtifacts = this.artifacts.filter(artifact =>
        selectedChoices.some(choice => artifact.elements.includes(choice))
      );

      if (this.relevantArtifacts.length === 0) {
        artifactList.innerHTML = '<p>No artifacts detected in current quantum state. Adjust Guideline selection for further analysis.</p>';
        exportBtn.disabled = true;
      } else {
        const fragment = document.createDocumentFragment();
        
        this.relevantArtifacts.forEach(artifact => {
          const artifactElement = this.createArtifactElement(artifact);
          fragment.appendChild(artifactElement);
        });

        artifactList.innerHTML = '';
        artifactList.appendChild(fragment);
        exportBtn.disabled = false;
      }
    } catch (error) {
      this.showError('Failed to process artifacts: ' + error.message);
    }
  }

  createArtifactElement(artifact) {
    const div = document.createElement('div');
    div.className = 'artifact';
    
    const h3 = document.createElement('h3');
    h3.textContent = artifact.name; // Use textContent for security
    
    const descriptionP = document.createElement('p');
    // Sanitize HTML content using DOMPurify
    descriptionP.innerHTML = DOMPurify.sanitize(artifact.description);
    
    const elementsP = document.createElement('p');
    elementsP.innerHTML = `<strong>Relevant Guidelines and Areas:</strong> ${artifact.elements.join(', ')}`;
    
    div.appendChild(h3);
    div.appendChild(descriptionP);
    div.appendChild(elementsP);
    
    return div;
  }

  exportToExcel() {
    try {
      const selectedChoices = Array.from(document.querySelectorAll('.choice-item.selected'))
        .map(btn => btn.getAttribute('data-choice'))
        .filter(Boolean);

      if (!window.XLSX) {
        throw new Error('XLSX library not loaded');
      }

      const workbook = window.XLSX.utils.book_new();
      
      // Create a worksheet for selected choices
      const choicesWS = window.XLSX.utils.aoa_to_sheet([
        ['Selected Guidelines'], 
        ...selectedChoices.map(choice => [choice])
      ]);
      window.XLSX.utils.book_append_sheet(workbook, choicesWS, 'Guidelines');

      // Create a worksheet for artifacts
      const artifactsData = [
        ['Artifact Designation', 'Functional Description', 'Applicable Guidelines']
      ].concat(this.relevantArtifacts.map(artifact => [
        artifact.name,
        artifact.description.replace(/<br>/g, ' ').replace(/<[^>]*>/g, ''), // Strip HTML for Excel
        artifact.elements.join(', ')
      ]));
      
      const artifactsWS = window.XLSX.utils.aoa_to_sheet(artifactsData);
      window.XLSX.utils.book_append_sheet(workbook, artifactsWS, 'Analyzed Artifacts');

      // Generate the Excel file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      window.XLSX.writeFile(workbook, `ArtifactMagic_Analysis_${timestamp}.xlsx`);
      
      this.showSuccess('Data exported successfully!');

    } catch (error) {
      this.showError('Export failed: ' + error.message);
    }
  }

  initializeMatrixAnimation() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.resizeMatrixCanvas();

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+[]{}|;:,.<>?';
    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize);

    const drops = new Array(columns).fill(1);

    const drawMatrix = () => {
      if (!this.isVisible) return;

      ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      this.matrixAnimation = requestAnimationFrame(drawMatrix);
    };

    this.matrixAnimation = requestAnimationFrame(drawMatrix);
  }

  resizeMatrixCanvas() {
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  pauseMatrixAnimation() {
    if (this.matrixAnimation) {
      cancelAnimationFrame(this.matrixAnimation);
      this.matrixAnimation = null;
    }
  }

  resumeMatrixAnimation() {
    if (!this.matrixAnimation && this.isVisible) {
      this.initializeMatrixAnimation();
    }
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type) {
    const container = document.querySelector('.container');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;

    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  cleanup() {
    // Clean up event listeners and animations
    this.pauseMatrixAnimation();
    
    // Remove event listeners
    const choiceGrid = document.getElementById('choiceGrid');
    if (choiceGrid) {
      choiceGrid.replaceWith(choiceGrid.cloneNode(true));
    }
  }

  // Input validation
  validateChoice(choice) {
    return this.choices.includes(choice);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ArtifactMagicApp();
  } catch (error) {
    console.error('Failed to initialize ArtifactMagicApp:', error);
    // Show user-friendly error message
    const container = document.querySelector('.container');
    if (container) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = 'Application failed to load. Please refresh the page.';
      container.insertBefore(errorDiv, container.firstChild);
    }
  }
});