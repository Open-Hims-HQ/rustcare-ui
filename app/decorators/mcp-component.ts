/**
 * MCP Component Registration for React/TypeScript
 * 
 * Supports two patterns:
 * 1. Class components: Call mcp.register() in methods
 * 2. Function components: Use mcp={} prop on custom components/buttons
 * 
 * Usage Examples:
 * 
 * Class Component:
 * ```tsx
 * class PharmacyList extends React.Component {
 *   handleCreate = () => {
 *     mcp.register({
 *       componentType: 'action',
 *       name: 'create_pharmacy',
 *       // ... config
 *     });
 *     // ... rest of logic
 *   }
 * }
 * ```
 * 
 * Function Component with mcp prop:
 * ```tsx
 * export const PharmacyList = () => {
 *   return (
 *     <Button 
 *       mcp={{
 *         name: 'create_pharmacy',
 *         label: 'Create Pharmacy',
 *         // ... config
 *       }}
 *     >
 *       Create
 *     </Button>
 *   );
 * };
 * ```
 */

import React from 'react';

export interface McpComponentConfig {
  /** Component name (e.g., "PharmacyList") */
  name: string;
  
  /** Component description */
  description?: string;
  
  /** Category (e.g., "pharmacy", "healthcare") */
  category: string;
  
  /** Required Zanzibar permission */
  requiresPermission?: string;
  
  /** Required roles (array) */
  requiredRoles?: string[];
  
  /** Is sensitive component */
  sensitive?: boolean;
  
  /** Route path (for pages) */
  routePath?: string;
  
  /** Component type: "page", "component", "button", "form", "modal", etc. */
  componentType: 'page' | 'component' | 'button' | 'form' | 'modal' | 'widget' | 'action';
  
  /** Parent component (for nested components) */
  parentComponent?: string;
  
  /** Icon name */
  icon?: string;
  
  /** Tags for search/filtering */
  tags?: string[];
  
  /** Component props schema (JSON Schema) */
  propsSchema?: Record<string, any>;
}

export interface McpButtonConfig {
  /** Action/button name */
  name: string;
  
  /** Display label */
  label?: string;
  
  /** Action description */
  description?: string;
  
  /** Required permission */
  requiresPermission?: string;
  
  /** Required roles */
  requiredRoles?: string[];
  
  /** Is sensitive action */
  sensitive?: boolean;
  
  /** API endpoint to call */
  apiEndpoint?: string;
  
  /** HTTP method */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  /** Handler function name (backend) */
  handlerFunction?: string;
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Icon name */
  icon?: string;
  
  /** Display order */
  displayOrder?: number;
  
  /** Component type (defaults to 'action' for buttons) */
  componentType?: 'action' | 'button';
}

/**
 * MCP Registry - Singleton for registering components and actions
 */
class McpRegistry {
  private registeredComponents = new Set<string>();
  private registeredActions = new Set<string>();

  /**
   * Register a component (called from class methods or function components)
   */
  async register(config: McpComponentConfig | McpButtonConfig): Promise<void> {
    const isAction = 'componentType' in config && 
                     (config.componentType === 'action' || config.componentType === 'button');
    
    if (isAction) {
      const actionConfig = config as McpButtonConfig;
      if (this.registeredActions.has(actionConfig.name)) {
        return; // Already registered
      }
      this.registeredActions.add(actionConfig.name);
      await registerAction(actionConfig);
    } else {
      const componentConfig = config as McpComponentConfig;
      if (this.registeredComponents.has(componentConfig.name)) {
        return; // Already registered
      }
      this.registeredComponents.add(componentConfig.name);
      await registerComponent(componentConfig);
    }
  }

  /**
   * Register component (wrapper for convenience)
   */
  async registerComponent(config: McpComponentConfig): Promise<void> {
    await this.register(config);
  }

  /**
   * Register action/button (wrapper for convenience)
   */
  async registerAction(config: McpButtonConfig): Promise<void> {
    await this.register(config);
  }
}

// Singleton instance
export const mcp = new McpRegistry();

/**
 * Register component with backend
 */
async function registerComponent(config: McpComponentConfig): Promise<void> {
  try {
    const response = await fetch('/api/v1/ui/components/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        component_name: config.name,
        component_path: getComponentPath(),
        component_type: config.componentType,
        display_name: config.name,
        description: config.description,
        route_path: config.routePath,
        category: config.category,
        requires_permission: config.requiresPermission,
        required_roles: config.requiredRoles || [],
        sensitive: config.sensitive || false,
        icon: config.icon,
        tags: config.tags || [],
        component_props: config.propsSchema || {},
        parent_component: config.parentComponent,
      }),
    });

    if (!response.ok) {
      console.warn(`Failed to register component ${config.name}:`, await response.text());
    }
  } catch (error) {
    console.warn(`Failed to register component ${config.name}:`, error);
  }
}

/**
 * Register action/button with backend
 */
async function registerAction(config: McpButtonConfig): Promise<void> {
  try {
    const response = await fetch('/api/v1/ui/components/actions/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        component_path: getComponentPath(),
        action_name: config.name,
        action_type: config.componentType || 'button',
        display_label: config.label || config.name,
        description: config.description,
        icon: config.icon,
        requires_permission: config.requiresPermission,
        required_roles: config.requiredRoles || [],
        sensitive: config.sensitive || false,
        action_config: {
          api_endpoint: config.apiEndpoint,
          method: config.method || 'POST',
          handler_function: config.handlerFunction,
        },
        variant: config.variant || 'primary',
        size: config.size || 'md',
        display_order: config.displayOrder || 0,
      }),
    });

    if (!response.ok) {
      console.warn(`Failed to register action ${config.name}:`, await response.text());
    }
  } catch (error) {
    console.warn(`Failed to register action ${config.name}:`, error);
  }
}

/**
 * Get component file path
 */
function getComponentPath(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  
  try {
    const stack = new Error().stack;
    if (stack) {
      const match = stack.match(/\((.+):\d+:\d+\)/);
      if (match) {
        return match[1];
      }
    }
  } catch (e) {
    // Ignore
  }
  
  return 'unknown';
}

/**
 * Props interface for components that accept mcp prop
 */
export interface WithMcpProps {
  /** MCP configuration for auto-registration */
  mcp?: McpButtonConfig | McpComponentConfig;
  
  /** Children */
  children?: React.ReactNode;
  
  /** Other props */
  [key: string]: any;
}

/**
 * Higher-order component to auto-register mcp prop
 */
export function withMcp<P extends object>(
  Component: React.ComponentType<P & WithMcpProps>
): React.ComponentType<P & WithMcpProps> {
  return function McpWrappedComponent(props: P & WithMcpProps) {
    const { mcp: mcpConfig, ...restProps } = props;
    
    // Auto-register when component mounts if mcp prop is provided
    React.useEffect(() => {
      if (mcpConfig) {
        mcp.register(mcpConfig as any).catch(console.error);
      }
    }, [mcpConfig]);
    
    return React.createElement(Component, restProps as P & WithMcpProps);
  };
}

/**
 * Hook to register MCP config
 */
export function useMcp(config: McpComponentConfig | McpButtonConfig | undefined) {
  React.useEffect(() => {
    if (config) {
      mcp.register(config as any).catch(console.error);
    }
  }, [config]);
}

