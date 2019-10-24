<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n dd">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>  
    
    <xsl:template match="/">
        
        <!-- Select the patient full name from Patient Info -->
        <xsl:if test="n:report/n:demographics/n:patient-info">
            <xsl:if test="n:report/n:demographics/n:patient-info/n:patient-name/@name-full">
                
                <span class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">	
                    <xsl:attribute name="dd:entityid">
                        <xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id">
                            <xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id"/>
                        </xsl:if>	
                    </xsl:attribute>
                    <xsl:attribute name="dd:contenttype">
                        <xsl:text>ENCNTRINFO</xsl:text>
                    </xsl:attribute>
                    <xsl:value-of select="n:report/n:demographics/n:patient-info/n:patient-name/@name-full"/>
                </span>
            </xsl:if>
        </xsl:if>
    </xsl:template>
   
</xsl:stylesheet>