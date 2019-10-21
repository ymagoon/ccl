<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:fo="http://www.w3.org/1999/XSL/Format" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
    xmlns:saxon="http://saxon.sf.net/" 
    xmlns:dd="DynamicDocumentation"
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    saxon:allow-all-built-in-types="yes"
    exclude-result-prefixes="xsl xs fn n cdocfx doc extfx saxon xr-date-formatter">
    
    <!--required to include vitalsmeasurementcommon.xslt -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/vitalsmeasurementcommon.xslt" /> 
    <!-- Uncomment this line to debug <xsl:import href="vitalsmeasurementcommon.xslt" /> -->
    
    <!-- Setting this variable to true will display Orthostatic Vitals. This is required as there is a common vitals format
		 shared across all different vitals displays -->
    <xsl:variable name="bIncludeOrthoVitals" as="xs:boolean" select="true()"/>
    
</xsl:stylesheet>
