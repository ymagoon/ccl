<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n dd">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <!-- template to output the table headings -->
    <xsl:template name="tempTableHead" >
        <xsl:param name="columnOne" as="xs:string" select="''"/>
        <xsl:param name="columnTwo" as="xs:string" select="''"/>
        <xsl:param name="columnThree" as="xs:string" select="''"/>
        <xsl:param name="columnFour" as="xs:string" select="''"/>
        <xsl:if test="$columnOne or $columnTwo or $columnThree or $columnFour">
            <thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
                <tr style="background-color:#F4F4F4;">
                    <xsl:if test="$columnOne">
                        <th style="font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000;"><xsl:value-of select="$columnOne"/></th>
                    </xsl:if>
                    <xsl:if test="$columnTwo">
                        <th style="font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000; border-left:1px solid #000;"><xsl:value-of select="$columnTwo"/></th>
                    </xsl:if>
                    <xsl:if test="$columnThree">
                        <th style="font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000; border-left:1px solid #000;"><xsl:value-of select="$columnThree"/></th>
                    </xsl:if>
                    <xsl:if test="$columnFour">
                        <th style="font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000; border-left:1px solid #000;"><xsl:value-of select="$columnFour"/></th>
                    </xsl:if>
                </tr>
            </thead>
        </xsl:if>
    </xsl:template>
    
    <!-- template to output the table rows for the measurement -->
    <xsl:template name="tempTableRow">
        <xsl:param name="measurement"/>
        <xsl:param name="columnOne" as="xs:string" select="''"/>
        <xsl:param name="columnTwo" as="xs:string" select="''"/>
        <xsl:param name="columnThree" as="xs:string" select="''"/>
        <xsl:param name="columnFour" as="xs:string" select="''"/>
        <xsl:param name="entityID" as="xs:string" select="''"/>
        <xsl:param name="contentType" as="xs:string" select="''"/>
        
        <xsl:if test="$measurement and ($columnOne or $columnTwo or $columnThree or $columnFour)">
            <tr class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
                <xsl:attribute name="dd:entityid" select="$entityID"/>
                <xsl:attribute name="dd:contenttype" select="$contentType"/>
                
                <xsl:if test="$columnOne">
                    <td style="border-top:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
                        <xsl:if test="$measurement/@column-one"><xsl:value-of disable-output-escaping="yes" select="$measurement/@column-one"/></xsl:if>
                    </td>
                </xsl:if>
                <xsl:if test="$columnTwo">
                    <td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
                        <xsl:if test="$measurement/@column-two"><xsl:value-of disable-output-escaping="yes" select="$measurement/@column-two"/></xsl:if>
                    </td>
                </xsl:if>
                <xsl:if test="$columnThree">
                    <td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
                        <xsl:if test="$measurement/@column-three"><xsl:value-of disable-output-escaping="yes" select="$measurement/@column-three"/></xsl:if>
                    </td>
                </xsl:if>
                <xsl:if test="$columnFour">
                    <td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
                        <xsl:if test="$measurement/@column-four"><xsl:value-of disable-output-escaping="yes" select="$measurement/@column-four"/></xsl:if>
                    </td>
                </xsl:if>
            </tr>
        </xsl:if>
    </xsl:template>
    
    <!-- template to output the table body for measurements -->
    <xsl:template name="tempTableBody">
        <xsl:param name="measurements"/>
        <xsl:param name="columnOne" as="xs:string" select="''"/>
        <xsl:param name="columnTwo" as="xs:string" select="''"/>
        <xsl:param name="columnThree" as="xs:string" select="''"/>
        <xsl:param name="columnFour" as="xs:string" select="''"/>
        
        <tbody>
            <xsl:for-each select="$measurements/measurement">
                <xsl:call-template name="tempTableRow">
                    <xsl:with-param name="measurement" select="."/>
                    <xsl:with-param name="columnOne" select="$columnOne"/>
                    <xsl:with-param name="columnTwo" select="$columnTwo"/>
                    <xsl:with-param name="columnThree" select="$columnThree"/>
                    <xsl:with-param name="columnFour" select="$columnFour"/>
                    <xsl:with-param name="entityID" select="@id"/>
                    <xsl:with-param name="contentType" select="@content-type"/>
                </xsl:call-template>
            </xsl:for-each>
        </tbody>
    </xsl:template>
    
    <!-- template to output up to a 4 column table with zebra striping -->
    <xsl:template name="tempMeasurementsTable">
        <xsl:param name="measurements"/>
        <xsl:param name="colHeadingOne" as="xs:string"/>
        <xsl:param name="colHeadingTwo" as="xs:string"/>
        <xsl:param name="colHeadingThree" as="xs:string"/>
        <xsl:param name="colHeadingFour" as="xs:string"/>
        <xsl:if test="$measurements/measurement">
            <table style="border:1px solid #000; border-spacing:0; border-collapse:collapse;" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true">
                <xsl:call-template name="tempTableHead">
                    <xsl:with-param name="columnOne" select="$colHeadingOne"/>
                    <xsl:with-param name="columnTwo" select="$colHeadingTwo"/>
                    <xsl:with-param name="columnThree" select="$colHeadingThree"/>
                    <xsl:with-param name="columnFour" select="$colHeadingFour"/>
                </xsl:call-template>
                
                <xsl:call-template name="tempTableBody">
                    <xsl:with-param name="measurements" select="$measurements"/>
                    <xsl:with-param name="columnOne" select="$colHeadingOne"/>
                    <xsl:with-param name="columnTwo" select="$colHeadingTwo"/>
                    <xsl:with-param name="columnThree" select="$colHeadingThree"/>
                    <xsl:with-param name="columnFour" select="$colHeadingFour"/>
                </xsl:call-template>
            </table>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>