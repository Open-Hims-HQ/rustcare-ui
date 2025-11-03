/**
 * Example usage of MCP component registration
 * 
 * Two patterns:
 * 1. Class components: Call mcp.register() in methods
 * 2. Function components: Use mcp={} prop on custom components/buttons
 */

import React from 'react';
import { mcp, McpButtonConfig, McpComponentConfig, useMcp } from './mcp-component';
import { Button } from '~/components/ui/button';

// ============================================================================
// Pattern 1: Class Component - Call mcp.register() in methods
// ============================================================================

class PharmacyListClass extends React.Component {
  componentDidMount() {
    // Register the page component
    mcp.register({
      name: "PharmacyList",
      description: "List all pharmacies for the organization",
      category: "pharmacy",
      requiresPermission: "pharmacy:read",
      sensitive: false,
      routePath: "/pharmacy/pharmacies",
      componentType: "page",
      icon: "pharmacy",
      tags: ["pharmacy", "inventory", "list"]
    }).catch(console.error);
  }

  handleCreate = () => {
    // Register action when method is called
    mcp.register({
      name: "create_pharmacy",
      label: "Create Pharmacy",
      description: "Create a new pharmacy",
      requiresPermission: "pharmacy:write",
      sensitive: false,
      apiEndpoint: "/api/v1/pharmacy/pharmacies",
      method: "POST",
      handlerFunction: "pharmacy::create_pharmacy",
      variant: "primary",
      size: "md",
      icon: "plus",
      displayOrder: 1,
      componentType: "action"
    }).catch(console.error);
    
    // ... rest of create logic
  }

  handleDelete = (id: string) => {
    // Register sensitive action
    mcp.register({
      name: "delete_pharmacy",
      label: "Delete Pharmacy",
      description: "Delete a pharmacy",
      requiresPermission: "pharmacy:delete",
      sensitive: true, // Sensitive action
      apiEndpoint: `/api/v1/pharmacy/pharmacies/${id}`,
      method: "DELETE",
      handlerFunction: "pharmacy::delete_pharmacy",
      variant: "danger",
      componentType: "action"
    }).catch(console.error);
    
    // ... rest of delete logic
  }

  render() {
    return (
      <div>
        <h1>Pharmacies</h1>
        <button onClick={this.handleCreate}>Create</button>
      </div>
    );
  }
}

// ============================================================================
// Pattern 2: Function Component - Use mcp={} prop on Button component
// ============================================================================

export const PharmacyList: React.FC = () => {
  // Register page component on mount
  useMcp({
    name: "PharmacyList",
    description: "List all pharmacies",
    category: "pharmacy",
    requiresPermission: "pharmacy:read",
    componentType: "page",
    routePath: "/pharmacy/pharmacies"
  });

  return (
    <div>
      <h1>Pharmacies</h1>
      
      {/* Button with mcp prop - auto-registers */}
      <Button
        mcp={{
          name: "create_pharmacy",
          label: "Create Pharmacy",
          description: "Create a new pharmacy",
          requiresPermission: "pharmacy:write",
          apiEndpoint: "/api/v1/pharmacy/pharmacies",
          method: "POST",
          handlerFunction: "pharmacy::create_pharmacy",
          variant: "primary",
          componentType: "action"
        }}
        onClick={() => {
          // Handle click
        }}
      >
        Create Pharmacy
      </Button>

      {/* Delete button with sensitive action */}
      <Button
        mcp={{
          name: "delete_pharmacy",
          label: "Delete",
          requiresPermission: "pharmacy:delete",
          sensitive: true,
          apiEndpoint: "/api/v1/pharmacy/pharmacies/123",
          method: "DELETE",
          variant: "danger",
          componentType: "action"
        }}
        variant="destructive"
        onClick={() => {
          // Handle delete
        }}
      >
        Delete
      </Button>
    </div>
  );
};

// ============================================================================
// Pattern 3: Direct mcp.register() call in function component method
// ============================================================================

export const PharmacyListDirect: React.FC = () => {
  React.useEffect(() => {
    // Register page
    mcp.register({
      name: "PharmacyListDirect",
      category: "pharmacy",
      componentType: "page",
      routePath: "/pharmacy/pharmacies"
    }).catch(console.error);
  }, []);

  const handleCreate = () => {
    // Register action when handler is called
    mcp.register({
      name: "create_pharmacy_direct",
      label: "Create",
      category: "pharmacy",
      requiresPermission: "pharmacy:write",
      apiEndpoint: "/api/v1/pharmacy/pharmacies",
      method: "POST",
      componentType: "action"
    }).catch(console.error);
    
    // ... rest of logic
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create</Button>
    </div>
  );
};

