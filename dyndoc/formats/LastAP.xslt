<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n cdocfx">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
    
    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
    
    <xsl:template match="/">
        
        <xsl:if test="n:report/n:clinical-data/n:assessment-plan-data/n:assessment-plan">
            <xsl:for-each select="n:report/n:clinical-data/n:assessment-plan-data/n:assessment-plan">
                <xsl:sort select="n:service-service-dt-tm" order="descending" />
                <!-- only output Latest AP -->
                <xsl:if test="position() = 1">
                    <div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
                        <xsl:attribute name="dd:entityid">
                            <xsl:value-of select="@event-id"/>
                        </xsl:attribute>
                        <xsl:attribute name="dd:contenttype">
                            <xsl:text>LASTAP</xsl:text>
                        </xsl:attribute>
                        <xsl:if test="n:plan-information">
                            <xsl:for-each select="n:plan-information">
                                <xsl:if test="n:text">
                                    <xsl:variable name="AssessmentPlanFO" as="xs:string">
					<xsl:value-of select="n:text"/>
                                    </xsl:variable>
                                    <xsl:variable name="APDisplay" as="xs:string">
                                        <!-- The first flag indicates what style(s) to remove from the converted HTML
                                            0-don't remove styles; 1-remove font face; 2-remove font size; 3-remove both font face and size
                                            If this is 0 or 1, then the next four flags will be ignored.
                                            
                                            The next four flags indicate font size boundaries and the desired smallest and largest font sizes.
                                            They represent lower bound, upper bound, desired smallest font size, and desired largest font size, respectively.
                                            Font sizes smaller than or equal to the lower bound will be replaced with the desired smallest font size.
                                            Font sizes larger than or equal to the upper bound will be replaced with the desired largest font size.
                                            For example, doc:convertFOtoHTML($FoBlob,3,8,15,8,14) means font sizes <= 8pt will be replaced with 8pt;
                                            while font sizes >= 15pt will be replaced with 14pt.
                                            -->
                                        <xsl:value-of select="doc:convertFOtoHTML($AssessmentPlanFO,3,8,14,8,14)"/>
                                    </xsl:variable>
                                    <xsl:value-of disable-output-escaping="yes" select="$APDisplay"/>
                                </xsl:if>
                            </xsl:for-each>
                            <xsl:if test="n:plan-addenda">
                                <xsl:for-each select="n:plan-addenda">
                                    <xsl:if test="n:text">
                                        <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                                            <div style="font-weight:bold;margin-left:1em">
                                                <xsl:value-of select="@title"/>
                                            </div>
                                            <div style="margin-left:2em;">
                                                <xsl:variable name="AddendaFO" as="xs:string">
                                                    <xsl:value-of select="n:text"/>
                                                </xsl:variable>
                                                <xsl:variable name="AddendaDisplay" as="xs:string">
                                                    <xsl:value-of select="doc:convertFOtoHTML($AddendaFO,3,8,14,8,14)"/>
                                                </xsl:variable>
                                                <xsl:value-of select="$AddendaDisplay" disable-output-escaping="yes" />
                                            </div>
                                        </div>
                                    </xsl:if>
                                </xsl:for-each>
                            </xsl:if>
                        </xsl:if>
                    </div>
                </xsl:if>
            </xsl:for-each>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>